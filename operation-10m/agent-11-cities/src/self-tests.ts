import {
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_SelfTestResult,
} from './types.ts';
import {
  op10mA11InequalityBand,
  op10mA11InequalityIndex,
  op10mA11GrowthBandFromScore,
} from './constants.ts';
import {
  buildOP10M_A11_InputsFromFixtures,
  createEmptyOP10M_A11_Persisted,
  recomputeOP10M_A11_RegionalUrbanLayer,
  validateOP10M_A11_State,
} from './recompute.ts';
import { op10mA11MetroRegionalGap, op10mA11AggregateUrbanGrowthByRegion } from './urban-growth-dynamics.ts';
import { op10mA11NationalLocalCoupling } from './urban-national-links.ts';
import {
  buildOP10M_A11_InfraInputsFromFixtures,
  createEmptyOP10M_A11_InfraPersisted,
  recomputeOP10M_A11_IntercityInfraLayer,
  validateOP10M_A11_InfraState,
} from './recompute-intercity-infra.ts';
import { op10mA11CorridorStressIndex } from './intercity-dependencies.ts';
import {
  buildOP10M_A11_CompositeInputsFromFixtures,
  recomputeOP10M_A11_CitiesRegionsComposite,
  validateOP10M_A11_CompositeState,
} from './composite-recompute.ts';
import { op10mA11NationalPrimateIndex, op10mA11ComputeUrbanHierarchy } from './urban-hierarchy.ts';
import { op10mA11BuildRegionalLinkageMatrix } from './regional-linkage-matrix.ts';
import {
  op10mA11ComputeCorridorFlows,
  op10mA11MaxCorridorFlow,
} from './urban-corridor-flow.ts';
import { op10mA11AnalyzeLinkageHubs } from './linkage-hub-centrality.ts';
import {
  op10mA11ComputeMigrationPressure,
  op10mA11RegionsWithMigrationSurge,
} from './regional-migration-pressure.ts';
import {
  op10mA11ComputeFiscalUrbanCoupling,
  op10mA11RegionalCohesionIndex,
} from './fiscal-urban-coupling.ts';
import { op10mA11ComputeSettlementVulnerability } from './settlement-vulnerability.ts';
import { runOP10M_A11_RegionalRegressionHarness } from './integration/regional-regression-harness.ts';
import {
  op10mA11ComputeMetropolitanAbsorptionStress,
  op10mA11NationalMetropolitanSaturation,
} from './metropolitan-absorption-stress.ts';
import { op10mA11ComputeRegionalServiceEquity } from './regional-service-equity.ts';
import {
  op10mA11ComputeRegionalConvergence,
  op10mA11StandingSpread,
} from './regional-convergence-velocity.ts';
import {
  op10mA11ComputePeriUrbanExpansionPressure,
  op10mA11NationalPeriUrbanPressureIndex,
} from './peri-urban-expansion-pressure.ts';
import { op10mA11ComputeRegionalInfrastructureBacklog } from './regional-infrastructure-backlog.ts';
import { op10mA11ComputeMultiTierGovernanceFriction } from './multi-tier-governance-friction.ts';
import { op10mA11ComputeRegionalHousingSpilloverPressure } from './regional-housing-spillover-pressure.ts';
import { op10mA11ComputeInterregionalTalentRetentionStress } from './interregional-talent-retention-stress.ts';
import { op10mA11ComputeClimateSettlementDisplacementRisk } from './climate-settlement-displacement-risk.ts';
import { op10mA11ComputeRegionalAmenityCostPressure } from './regional-amenity-cost-pressure.ts';
import { op10mA11ComputeDigitalConnectivityDecentralizationShift } from './digital-connectivity-decentralization-shift.ts';
import { op10mA11ComputeSettlementRelocationBurden } from './settlement-relocation-burden.ts';
import { op10mA11ComputeRegionalEmploymentAnchorStress } from './regional-employment-anchor-stress.ts';
import { op10mA11ComputeInterregionalCommuteAffordabilityWedge } from './interregional-commute-affordability-wedge.ts';
import { op10mA11ComputeSettlementReceptionCapacityStrain } from './settlement-reception-capacity-strain.ts';
import { op10mA11ComputeRegionalLandUseRegulatoryGridlock } from './regional-land-use-regulatory-gridlock.ts';
import { op10mA11ComputeInterregionalMobilityAffordabilityTrap } from './interregional-mobility-affordability-trap.ts';
import { op10mA11ComputeSettlementInfrastructureAbsorptionGap } from './settlement-infrastructure-absorption-gap.ts';
import { op10mA11ComputeRegionalReliefCoordinationOverhead } from './regional-relief-coordination-overhead.ts';
import { op10mA11ComputeInterregionalCorridorEquityDrift } from './interregional-corridor-equity-drift.ts';
import { op10mA11ComputeSettlementClimateAdaptationLag } from './settlement-climate-adaptation-lag.ts';
import { op10mA11ComputeRegionalFiscalCapacityStrain } from './regional-fiscal-capacity-strain.ts';
import { op10mA11ComputeInterregionalNetworkResilienceErosion } from './interregional-network-resilience-erosion.ts';
import { op10mA11ComputeSettlementLongHorizonCapacityRisk } from './settlement-long-horizon-capacity-risk.ts';
import { op10mA11ComputeRegionalCohesionIntegrityPressure } from './regional-cohesion-integrity-pressure.ts';
import { op10mA11ComputeInterregionalReliefDeliveryEquityGap } from './interregional-relief-delivery-equity-gap.ts';
import { op10mA11ComputeSettlementSystemicFragilityComposite } from './settlement-systemic-fragility-composite.ts';
import { op10mA11ComputeRegionalGovernanceResilienceDecay } from './regional-governance-resilience-decay.ts';
import { op10mA11ComputeInterregionalMigrationStabilityErosion } from './interregional-migration-stability-erosion.ts';
import { op10mA11ComputeSettlementAdaptiveCapacityCeiling } from './settlement-adaptive-capacity-ceiling.ts';
import { op10mA11ComputeRegionalFiscalGovernanceCouplingStrain } from './regional-fiscal-governance-coupling-strain.ts';
import { op10mA11ComputeInterregionalNetworkEquityTension } from './interregional-network-equity-tension.ts';
import { op10mA11ComputeSettlementResilienceFrontierPressure } from './settlement-resilience-frontier-pressure.ts';
import { op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue } from './regional-meta-governance-coordination-fatigue.ts';
import { op10mA11ComputeInterregionalCapitalMobilityAsymmetry } from './interregional-capital-mobility-asymmetry.ts';
import { op10mA11ComputeSettlementCompoundShockSaturation } from './settlement-compound-shock-saturation.ts';
import { op10mA11ComputeRegionalInstitutionalTrustErosion } from './regional-institutional-trust-erosion.ts';
import { op10mA11ComputeInterregionalLiquidityFragmentationStress } from './interregional-liquidity-fragmentation-stress.ts';
import { op10mA11ComputeSettlementCascadingFailureRisk } from './settlement-cascading-failure-risk.ts';
import { op10mA11ComputeRegionalSocialContractFragility } from './regional-social-contract-fragility.ts';
import { op10mA11ComputeInterregionalCapitalFlightPanic } from './interregional-capital-flight-panic.ts';
import { op10mA11ComputeSettlementIrrecoverableCollapseThreshold } from './settlement-irrecoverable-collapse-threshold.ts';
import { op10mA11ComputeRegionalSettlementLegitimacyCollapse } from './regional-settlement-legitimacy-collapse.ts';
import { op10mA11ComputeInterregionalFiscalPanicContagion } from './interregional-fiscal-panic-contagion.ts';
import { op10mA11ComputeSettlementTerminalStateLockIn } from './settlement-terminal-state-lock-in.ts';
import { op10mA11ComputeRegionalGovernanceVacuumEscalation } from './regional-governance-vacuum-escalation.ts';
import { op10mA11ComputeInterregionalSettlementAbandonmentSpiral } from './interregional-settlement-abandonment-spiral.ts';
import { op10mA11ComputeSettlementPostCollapseRecoveryImpossibility } from './settlement-post-collapse-recovery-impossibility.ts';
import { op10mA11ComputeRegionalStateCollapseCascadeAmplification } from './regional-state-collapse-cascade-amplification.ts';
import { op10mA11ComputeInterregionalHollowRegionContagion } from './interregional-hollow-region-contagion.ts';
import { op10mA11ComputeSettlementPermanentDepopulationLock } from './settlement-permanent-depopulation-lock.ts';
import { op10mA11ComputeRegionalTotalCollapseSingularityPressure } from './regional-total-collapse-singularity-pressure.ts';
import { op10mA11ComputeInterregionalVoidExpansionVelocity } from './interregional-void-expansion-velocity.ts';
import { op10mA11ComputeSettlementExistentialContinuityFracture } from './settlement-existential-continuity-fracture.ts';
import { op10mA11ComputeRegionalCollapseHorizonConvergence } from './regional-collapse-horizon-convergence.ts';
import { op10mA11ComputeInterregionalVoidTotalizationSurge } from './interregional-void-totalization-surge.ts';
import { op10mA11ComputeSettlementExistentialTerminusLock } from './settlement-existential-terminus-lock.ts';
import { op10mA11ComputeRegionalAbsoluteCollapseHorizonLock } from './regional-absolute-collapse-horizon-lock.ts';
import { op10mA11ComputeInterregionalVoidFinalizationCascade } from './interregional-void-finalization-cascade.ts';
import { op10mA11ComputeSettlementExistentialObliterationThreshold } from './settlement-existential-obliteration-threshold.ts';
import { op10mA11ComputeRegionalUltimateCollapseSingularitySeal } from './regional-ultimate-collapse-singularity-seal.ts';
import { op10mA11ComputeInterregionalVoidAnnihilationConvergence } from './interregional-void-annihilation-convergence.ts';
import { op10mA11ComputeSettlementExistentialNullStateLock } from './settlement-existential-null-state-lock.ts';
import { op10mA11ComputeRegionalCollapseExistenceSingularityPoint } from './regional-collapse-existence-singularity-point.ts';
import { op10mA11ComputeInterregionalVoidExistenceAnnihilationFront } from './interregional-void-existence-annihilation-front.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteZeroLock } from './settlement-existential-absolute-zero-lock.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityNode } from './regional-collapse-omni-singularity-node.ts';
import { op10mA11ComputeInterregionalVoidAbsoluteErosionSurge } from './interregional-void-absolute-erosion-surge.ts';
import { op10mA11ComputeSettlementExistentialFinalNullityLock } from './settlement-existential-final-nullity-lock.ts';
import { op10mA11ComputeRegionalCollapseTotalSingularityVertex } from './regional-collapse-total-singularity-vertex.ts';
import { op10mA11ComputeInterregionalVoidTerminalErosionCascade } from './interregional-void-terminal-erosion-cascade.ts';
import { op10mA11ComputeSettlementExistentialUltimateNullitySeal } from './settlement-existential-ultimate-nullity-seal.ts';
import { op10mA11ComputeRegionalCollapseAbsoluteSingularityApex } from './regional-collapse-absolute-singularity-apex.ts';
import { op10mA11ComputeInterregionalVoidCompleteErosionTerminality } from './interregional-void-complete-erosion-terminality.ts';
import { op10mA11ComputeSettlementExistentialFinalNullityClosure } from './settlement-existential-final-nullity-closure.ts';
import { op10mA11ComputeRegionalCollapseUltimateSingularityZenith } from './regional-collapse-ultimate-singularity-zenith.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionFinality } from './interregional-void-total-erosion-finality.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict } from './settlement-existential-absolute-nullity-verdict.ts';
import { op10mA11ComputeRegionalCollapseTotalSingularityNexus } from './regional-collapse-total-singularity-nexus.ts';
import { op10mA11ComputeInterregionalVoidAbsoluteErosionTermination } from './interregional-void-absolute-erosion-termination.ts';
import { op10mA11ComputeSettlementExistentialFinalNullitySentence } from './settlement-existential-final-nullity-sentence.ts';
import { op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination } from './regional-collapse-absolute-singularity-culmination.ts';
import { op10mA11ComputeInterregionalVoidCompleteErosionExtinction } from './interregional-void-complete-erosion-extinction.ts';
import { op10mA11ComputeSettlementExistentialTotalNullityDecree } from './settlement-existential-total-nullity-decree.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularitySynthesis } from './regional-collapse-omni-singularity-synthesis.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionAnnihilation } from './interregional-void-total-erosion-annihilation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityMandate } from './settlement-existential-absolute-nullity-mandate.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityConvergence } from './regional-collapse-omni-singularity-convergence.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionObliteration } from './interregional-void-total-erosion-obliteration.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityBinding } from './settlement-existential-absolute-nullity-binding.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityIntegration } from './regional-collapse-omni-singularity-integration.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionEradication } from './interregional-void-total-erosion-eradication.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity } from './settlement-existential-absolute-nullity-continuity.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityUnification } from './regional-collapse-omni-singularity-unification.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionElimination } from './interregional-void-total-erosion-elimination.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity } from './settlement-existential-absolute-nullity-perpetuity.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityConsolidation } from './regional-collapse-omni-singularity-consolidation.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionDissolution } from './interregional-void-total-erosion-dissolution.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityImmutability } from './settlement-existential-absolute-nullity-immutability.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityCoalescence } from './regional-collapse-omni-singularity-coalescence.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionSublimation } from './interregional-void-total-erosion-sublimation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityPermanence } from './settlement-existential-absolute-nullity-permanence.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityAmalgamation } from './regional-collapse-omni-singularity-amalgamation.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionAtomization } from './interregional-void-total-erosion-atomization.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityInevitability } from './settlement-existential-absolute-nullity-inevitability.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularitySymbiosis } from './regional-collapse-omni-singularity-symbiosis.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionPulverization } from './interregional-void-total-erosion-pulverization.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityDeterminism } from './settlement-existential-absolute-nullity-determinism.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityHolism } from './regional-collapse-omni-singularity-holism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionGranulation } from './interregional-void-total-erosion-granulation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityCertitude } from './settlement-existential-absolute-nullity-certitude.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityMonism } from './regional-collapse-omni-singularity-monism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionComminution } from './interregional-void-total-erosion-comminution.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityConviction } from './settlement-existential-absolute-nullity-conviction.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityTotalism } from './regional-collapse-omni-singularity-totalism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionAttrition } from './interregional-void-total-erosion-attrition.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityFinality } from './settlement-existential-absolute-nullity-finality.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityUniversalism } from './regional-collapse-omni-singularity-universalism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionAblation } from './interregional-void-total-erosion-ablation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullitySealing } from './settlement-existential-absolute-nullity-sealing.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityCosmism } from './regional-collapse-omni-singularity-cosmism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionDepletion } from './interregional-void-total-erosion-depletion.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityRatification } from './settlement-existential-absolute-nullity-ratification.ts';
import { op10mA11ComputeRegionalCollapseOmniSingularityPantheism } from './regional-collapse-omni-singularity-pantheism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionExhaustion } from './interregional-void-total-erosion-exhaustion.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityCanonization } from './settlement-existential-absolute-nullity-canonization.ts';

function push(out: OP10M_A11_SelfTestResult[], id: string, passed: boolean, detail: string) {
  out.push({ id, passed, detail });
}

const sampleCities: OP10M_A11_CityGrowthSlice[] = [
  {
    cityId: 'sydney',
    regionId: 'NSW',
    growthScore: 72,
    growthBand: 'fast',
    absorptionHeadroom: 22,
    gateway: true,
  },
  {
    cityId: 'newcastle',
    regionId: 'NSW',
    growthScore: 48,
    growthBand: 'steady',
    absorptionHeadroom: 40,
    gateway: false,
  },
  {
    cityId: 'melbourne',
    regionId: 'VIC',
    growthScore: 68,
    growthBand: 'fast',
    absorptionHeadroom: 28,
    gateway: true,
  },
  {
    cityId: 'hobart',
    regionId: 'TAS',
    growthScore: 38,
    growthBand: 'slow',
    absorptionHeadroom: 52,
    gateway: true,
  },
  {
    cityId: 'darwin',
    regionId: 'NT',
    growthScore: 34,
    growthBand: 'slow',
    absorptionHeadroom: 55,
    gateway: true,
  },
];

export function runOP10M_A11_SelfTests(): OP10M_A11_SelfTestResult[] {
  const out: OP10M_A11_SelfTestResult[] = [];

  push(out, 'a11_01', OP10M_A11_CORE_REGIONS.length === 8, 'core region catalog');
  push(
    out,
    'a11_02',
    op10mA11GrowthBandFromScore(80) === 'surging' && op10mA11GrowthBandFromScore(10) === 'contracting',
    'growth band mapping',
  );

  const idxBalanced = op10mA11InequalityIndex([50, 51, 49, 50, 52, 48, 50, 51]);
  const idxPolar = op10mA11InequalityIndex([30, 35, 40, 45, 50, 55, 70, 85]);
  push(
    out,
    'a11_03',
    idxBalanced < idxPolar && op10mA11InequalityBand(idxPolar) !== 'balanced',
    `inequality index ${idxBalanced.toFixed(1)} vs ${idxPolar.toFixed(1)}`,
  );

  const inputs = buildOP10M_A11_InputsFromFixtures({
    turn: 3,
    cities: sampleCities,
    regions: {
      NSW: {
        regionId: 'NSW',
        economyScore: 58,
        momentumBand: 'growing',
        developmentTier: 'advanced',
        infrastructureQuality: 60,
      },
      VIC: {
        regionId: 'VIC',
        economyScore: 56,
        momentumBand: 'growing',
        developmentTier: 'advanced',
        infrastructureQuality: 58,
      },
      TAS: {
        regionId: 'TAS',
        economyScore: 44,
        momentumBand: 'stable',
        developmentTier: 'developing',
        infrastructureQuality: 46,
      },
      NT: {
        regionId: 'NT',
        economyScore: 42,
        momentumBand: 'weakening',
        developmentTier: 'emerging',
        infrastructureQuality: 40,
      },
    },
    national: {
      turn: 3,
      nationalGrowthBand: 'strong',
      distributionBand: 'uneven',
      networkFreight: 62,
      networkDigital: 58,
      capitalCityBias: 14,
    },
  });

  const first = recomputeOP10M_A11_RegionalUrbanLayer(inputs, null);
  push(
    out,
    'a11_04',
    validateOP10M_A11_State(first.state).length === 0 && first.state.regions.NSW.leading,
    first.state.summary,
  );

  const second = recomputeOP10M_A11_RegionalUrbanLayer(
    buildOP10M_A11_InputsFromFixtures({
      ...inputs,
      turn: 4,
      national: {
        ...inputs.national,
        distributionBand: 'highly_uneven',
        capitalCityBias: 22,
      },
    }),
    first.persisted,
  );
  push(
    out,
    'a11_05',
    second.state.inequalityIndex >= first.state.inequalityIndex,
    `inequality delta ${(second.state.inequalityIndex - first.state.inequalityIndex).toFixed(1)}`,
  );

  const urban = op10mA11AggregateUrbanGrowthByRegion(sampleCities);
  const gap = op10mA11MetroRegionalGap(urban);
  push(out, 'a11_06', gap > 0 && urban.NSW.gatewayAvg > urban.TAS.gatewayAvg, `metro gap ${gap}`);

  const coupling = op10mA11NationalLocalCoupling(inputs.national);
  push(out, 'a11_07', coupling > 20, `coupling ${coupling.toFixed(1)}`);

  push(
    out,
    'a11_08',
    second.derived.length > 0 && second.derived.every((d) => d.id.startsWith('a11_')),
    second.derived.map((d) => d.kind).join(', ') || 'none',
  );

  const emptyPersisted = createEmptyOP10M_A11_Persisted();
  push(out, 'a11_09', emptyPersisted.revision === 0 && emptyPersisted.history.length === 0, 'empty persisted');

  push(
    out,
    'a11_10',
    first.state.regions.NT.lagging && first.state.regions.NT.spilloverBand !== 'integrated',
    first.state.regions.NT.narrative,
  );

  const infraLinks = [
    {
      linkId: 'link_highway_sydney__melbourne',
      kind: 'highway' as const,
      cityA: 'sydney',
      cityB: 'melbourne',
      regionA: 'NSW' as const,
      regionB: 'VIC' as const,
      utilization: 88,
      health: 'degraded' as const,
      strategic: true,
      redundancyGroup: 'highway_east_core',
    },
    {
      linkId: 'link_freight_rail_sydney__melbourne',
      kind: 'freight_rail' as const,
      cityA: 'sydney',
      cityB: 'melbourne',
      regionA: 'NSW' as const,
      regionB: 'VIC' as const,
      utilization: 82,
      health: 'degraded' as const,
      strategic: true,
      redundancyGroup: 'highway_east_core',
    },
  ];

  const infraInputs = buildOP10M_A11_InfraInputsFromFixtures({
    turn: 5,
    cities: sampleCities,
    links: infraLinks,
    transportNeeds: [
      { regionId: 'NSW', category: 'transport', severity: 'critical', status: 'open' },
      { regionId: 'NT', category: 'transport', severity: 'high', status: 'open' },
    ],
    regions: {
      NSW: { infrastructureQuality: 38 },
      NT: { infrastructureQuality: 36 },
    },
    networkFreight: 44,
    networkDigital: 48,
  });

  const infra1 = recomputeOP10M_A11_IntercityInfraLayer(infraInputs, null);
  push(
    out,
    'a11_11',
    validateOP10M_A11_InfraState(infra1.state).length === 0 && infra1.state.bottlenecks.some((b) => b.regionId === 'NSW'),
    infra1.state.summary,
  );

  push(
    out,
    'a11_12',
    infra1.state.dependencies.some((d) => d.chokePoint) &&
      infra1.derived.some((d) => d.kind === 'intercity_chokepoint'),
    `deps ${infra1.state.dependencies.length}`,
  );

  const stress = op10mA11CorridorStressIndex(infraLinks);
  push(out, 'a11_13', stress >= 50, `corridor stress ${stress}`);

  const infra2 = recomputeOP10M_A11_IntercityInfraLayer(
    buildOP10M_A11_InfraInputsFromFixtures({
      ...infraInputs,
      turn: 6,
      links: infraLinks.map((l) => ({ ...l, utilization: 40, health: 'strong' as const })),
    }),
    infra1.persisted,
  );
  push(
    out,
    'a11_14',
    infra2.state.corridorStressIndex < infra1.state.corridorStressIndex,
    `stress ${infra1.state.corridorStressIndex} → ${infra2.state.corridorStressIndex}`,
  );

  const emptyInfra = createEmptyOP10M_A11_InfraPersisted();
  push(out, 'a11_15', emptyInfra.revision === 0, 'empty infra persisted');

  push(
    out,
    'a11_16',
    infra1.state.dependencies.every((d) => d.dependentRegions.length === 2),
    'dependency region pairs',
  );

  const hierarchy = op10mA11ComputeUrbanHierarchy(sampleCities);
  push(
    out,
    'a11_17',
    hierarchy.length === 8 && hierarchy.some((h) => h.regionId === 'NSW' && h.gatewayShare > 50),
    `NSW gateway share ${hierarchy.find((h) => h.regionId === 'NSW')?.gatewayShare}`,
  );

  const nationalPrimate = op10mA11NationalPrimateIndex(hierarchy);
  push(out, 'a11_18', nationalPrimate > 0, `national primate ${nationalPrimate}`);

  const linkMatrix = op10mA11BuildRegionalLinkageMatrix(infraLinks);
  push(out, 'a11_19', linkMatrix.length >= 1 && linkMatrix[0].viaLinks >= 1, `link edges ${linkMatrix.length}`);

  const compositeIn = buildOP10M_A11_CompositeInputsFromFixtures({
    turn: 7,
    urban: inputs,
    infra: infraInputs,
  });
  const composite = recomputeOP10M_A11_CitiesRegionsComposite(compositeIn, null);
  push(
    out,
    'a11_20',
    validateOP10M_A11_CompositeState(composite.state).length === 0 &&
      composite.state.reliefPlaybook.length > 0,
    composite.state.summary.slice(0, 120),
  );

  push(
    out,
    'a11_21',
    composite.derived.some((d) => d.kind === 'integrated_relief_priority') ||
      composite.derived.some((d) => d.kind === 'primate_concentration_risk'),
    composite.derived.map((d) => d.kind).join(', ') || 'none',
  );

  const composite2 = recomputeOP10M_A11_CitiesRegionsComposite(
    buildOP10M_A11_CompositeInputsFromFixtures({ turn: 8, urban: inputs, infra: infraInputs }),
    composite.persisted,
  );
  push(
    out,
    'a11_22',
    composite2.state.revision === composite.state.revision + 1,
    `revision ${composite.state.revision}→${composite2.state.revision}`,
  );

  const flows = op10mA11ComputeCorridorFlows({
    cities: sampleCities,
    links: infraLinks,
    linkages: linkMatrix,
  });
  push(
    out,
    'a11_23',
    flows.length >= 1 && op10mA11MaxCorridorFlow(flows) >= 40 && flows[0].band !== 'light',
    `peak flow ${op10mA11MaxCorridorFlow(flows)} (${flows[0]?.band})`,
  );

  const hubs = op10mA11AnalyzeLinkageHubs(linkMatrix);
  push(
    out,
    'a11_24',
    hubs.length === 8 && hubs.every((h) => h.narrative.includes('linkage role')),
    `top hub ${hubs[0]?.regionId} (${hubs[0]?.role})`,
  );

  push(
    out,
    'a11_25',
    composite.state.corridorFlows.length >= 1 && composite.state.linkageHubs.length === 8,
    `flows ${composite.state.corridorFlows.length}`,
  );

  push(
    out,
    'a11_26',
    composite.state.maxCorridorFlow > 0 && composite.state.schemaVersion === '10m.a11.composite.45',
    composite.state.schemaVersion,
  );

  push(
    out,
    'a11_27',
    composite.derived.some((d) => d.kind === 'corridor_flow_surge' || d.kind === 'linkage_hub_overload'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_28',
    composite.state.corridorFlows[0].explanation.includes('corridor'),
    composite.state.corridorFlows[0]?.band ?? 'none',
  );

  const migration = op10mA11ComputeMigrationPressure({
    regions: composite.state.urban.regions,
    bottlenecks: composite.state.infra.bottlenecks,
    linkageHubs: composite.state.linkageHubs,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_29',
    migration.length === 8 && migration.every((m) => m.narrative.includes('migration')),
    `top pressure ${migration[0]?.regionId} ${migration[0]?.band}`,
  );

  const settlement = op10mA11ComputeSettlementVulnerability({
    regions: composite.state.urban.regions,
    bottlenecks: composite.state.infra.bottlenecks,
    linkageHubs: composite.state.linkageHubs,
    fragilityIndex: composite.state.fragilityIndex,
  });
  push(
    out,
    'a11_30',
    settlement.length === 8 && settlement[0].drivers.length >= 1,
    `top vulnerability ${settlement[0]?.regionId} (${settlement[0]?.band})`,
  );

  const fiscal = op10mA11ComputeFiscalUrbanCoupling({
    national: inputs.national,
    regions: composite.state.urban.regions,
  });
  push(
    out,
    'a11_31',
    fiscal.rows.length === 8 && fiscal.nationalIndex > 0,
    `fiscal national index ${fiscal.nationalIndex}`,
  );

  const cohesion = op10mA11RegionalCohesionIndex({
    inequalityIndex: composite.state.urban.inequalityIndex,
    fragilityIndex: composite.state.fragilityIndex,
    fiscalNationalIndex: fiscal.nationalIndex,
    maxMigrationPressure: migration[0]?.netPressure ?? 0,
  });
  push(
    out,
    'a11_32',
    composite.state.regionalCohesionIndex === cohesion &&
      composite.state.migrationPressure.length === 8 &&
      composite.state.fiscalUrbanCoupling.length === 8,
    `cohesion ${composite.state.regionalCohesionIndex}`,
  );

  push(
    out,
    'a11_33',
    composite.derived.some((d) => d.kind === 'migration_pressure_spike') ||
      op10mA11RegionsWithMigrationSurge(migration).length >= 1,
    composite.derived.map((d) => d.kind).join(', '),
  );

  const harness = runOP10M_A11_RegionalRegressionHarness(10);
  push(out, 'a11_34', harness.ok, harness.detail);

  push(
    out,
    'a11_35',
    composite.state.settlementVulnerability.every((s) => s.narrative.includes('settlement')),
    composite.state.settlementVulnerability[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_36',
    composite.persisted.lastCohesionIndex === composite.state.regionalCohesionIndex &&
      composite.persisted.lastServiceEquityIndex === composite.state.nationalServiceEquityIndex &&
      composite.persisted.lastInfrastructureBacklogIndex === composite.state.nationalInfrastructureBacklogIndex &&
      composite.persisted.lastHousingSpilloverIndex === composite.state.nationalHousingSpilloverIndex &&
      composite.persisted.lastClimateDisplacementIndex === composite.state.nationalClimateDisplacementIndex &&
      composite.persisted.lastAmenityCostIndex === composite.state.nationalAmenityCostIndex &&
      composite.persisted.lastRelocationBurdenIndex === composite.state.nationalRelocationBurdenIndex &&
      composite.persisted.lastEmploymentAnchorIndex === composite.state.nationalEmploymentAnchorIndex &&
      composite.persisted.lastCommuteWedgeIndex === composite.state.nationalCommuteWedgeIndex &&
      composite.persisted.lastReceptionStrainIndex === composite.state.nationalReceptionStrainIndex &&
      composite.persisted.lastLandUseGridlockIndex === composite.state.nationalLandUseGridlockIndex &&
      composite.persisted.lastMobilityTrapIndex === composite.state.nationalMobilityTrapIndex &&
      composite.persisted.lastAbsorptionGapIndex === composite.state.nationalAbsorptionGapIndex &&
      composite.persisted.lastReliefOverheadIndex === composite.state.nationalReliefOverheadIndex &&
      composite.persisted.lastCorridorEquityDriftIndex === composite.state.nationalCorridorEquityDriftIndex &&
      composite.persisted.lastClimateAdaptationLagIndex === composite.state.nationalClimateAdaptationLagIndex &&
      composite.persisted.lastFiscalCapacityStrainIndex === composite.state.nationalFiscalCapacityStrainIndex &&
      composite.persisted.lastNetworkResilienceErosionIndex === composite.state.nationalNetworkResilienceErosionIndex &&
      composite.persisted.lastLongHorizonCapacityRiskIndex === composite.state.nationalLongHorizonCapacityRiskIndex &&
      composite.persisted.lastCohesionIntegrityIndex === composite.state.nationalCohesionIntegrityIndex &&
      composite.persisted.lastReliefEquityGapIndex === composite.state.nationalReliefEquityGapIndex &&
      composite.persisted.lastSystemicFragilityIndex === composite.state.nationalSystemicFragilityIndex &&
      composite.persisted.lastGovernanceResilienceDecayIndex === composite.state.nationalGovernanceResilienceDecayIndex &&
      composite.persisted.lastMigrationStabilityErosionIndex === composite.state.nationalMigrationStabilityErosionIndex &&
      composite.persisted.lastAdaptiveCapacityCeilingIndex === composite.state.nationalAdaptiveCapacityCeilingIndex &&
      composite.persisted.lastFiscalGovernanceCouplingIndex === composite.state.nationalFiscalGovernanceCouplingIndex &&
      composite.persisted.lastNetworkEquityTensionIndex === composite.state.nationalNetworkEquityTensionIndex &&
      composite.persisted.lastResilienceFrontierIndex === composite.state.nationalResilienceFrontierIndex &&
      composite.persisted.lastMetaGovernanceFatigueIndex === composite.state.nationalMetaGovernanceFatigueIndex &&
      composite.persisted.lastCapitalMobilityAsymmetryIndex === composite.state.nationalCapitalMobilityAsymmetryIndex &&
      composite.persisted.lastCompoundShockSaturationIndex === composite.state.nationalCompoundShockSaturationIndex &&
      composite.persisted.lastInstitutionalTrustErosionIndex === composite.state.nationalInstitutionalTrustErosionIndex &&
      composite.persisted.lastLiquidityFragmentationIndex === composite.state.nationalLiquidityFragmentationIndex &&
      composite.persisted.lastCascadingFailureRiskIndex === composite.state.nationalCascadingFailureRiskIndex &&
      composite.persisted.lastSocialContractFragilityIndex === composite.state.nationalSocialContractFragilityIndex &&
      composite.persisted.lastCapitalFlightPanicIndex === composite.state.nationalCapitalFlightPanicIndex &&
      composite.persisted.lastIrrecoverableCollapseThresholdIndex === composite.state.nationalIrrecoverableCollapseThresholdIndex &&
      composite.persisted.lastSettlementLegitimacyCollapseIndex === composite.state.nationalSettlementLegitimacyCollapseIndex &&
      composite.persisted.lastFiscalPanicContagionIndex === composite.state.nationalFiscalPanicContagionIndex &&
      composite.persisted.lastTerminalStateLockInIndex === composite.state.nationalTerminalStateLockInIndex &&
      composite.persisted.lastGovernanceVacuumEscalationIndex === composite.state.nationalGovernanceVacuumEscalationIndex &&
      composite.persisted.lastSettlementAbandonmentSpiralIndex === composite.state.nationalSettlementAbandonmentSpiralIndex &&
      composite.persisted.lastPostCollapseRecoveryImpossibilityIndex === composite.state.nationalPostCollapseRecoveryImpossibilityIndex &&
      composite.persisted.lastStateCollapseCascadeAmplificationIndex === composite.state.nationalStateCollapseCascadeAmplificationIndex &&
      composite.persisted.lastHollowRegionContagionIndex === composite.state.nationalHollowRegionContagionIndex &&
      composite.persisted.lastPermanentDepopulationLockIndex === composite.state.nationalPermanentDepopulationLockIndex &&
      composite.persisted.lastTotalCollapseSingularityIndex === composite.state.nationalTotalCollapseSingularityIndex &&
      composite.persisted.lastVoidExpansionVelocityIndex === composite.state.nationalVoidExpansionVelocityIndex &&
      composite.persisted.lastExistentialContinuityFractureIndex === composite.state.nationalExistentialContinuityFractureIndex &&
      composite.persisted.lastCollapseHorizonConvergenceIndex === composite.state.nationalCollapseHorizonConvergenceIndex &&
      composite.persisted.lastVoidTotalizationSurgeIndex === composite.state.nationalVoidTotalizationSurgeIndex &&
      composite.persisted.lastExistentialTerminusLockIndex === composite.state.nationalExistentialTerminusLockIndex &&
      composite.persisted.lastAbsoluteCollapseHorizonLockIndex === composite.state.nationalAbsoluteCollapseHorizonLockIndex &&
      composite.persisted.lastVoidFinalizationCascadeIndex === composite.state.nationalVoidFinalizationCascadeIndex &&
      composite.persisted.lastExistentialObliterationThresholdIndex === composite.state.nationalExistentialObliterationThresholdIndex &&
      composite.persisted.lastUltimateCollapseSingularitySealIndex === composite.state.nationalUltimateCollapseSingularitySealIndex &&
      composite.persisted.lastVoidAnnihilationConvergenceIndex === composite.state.nationalVoidAnnihilationConvergenceIndex &&
      composite.persisted.lastExistentialNullStateLockIndex === composite.state.nationalExistentialNullStateLockIndex &&
      composite.persisted.lastCollapseExistenceSingularityPointIndex === composite.state.nationalCollapseExistenceSingularityPointIndex &&
      composite.persisted.lastVoidExistenceAnnihilationFrontIndex === composite.state.nationalVoidExistenceAnnihilationFrontIndex &&
      composite.persisted.lastExistentialAbsoluteZeroLockIndex === composite.state.nationalExistentialAbsoluteZeroLockIndex &&
      composite.persisted.lastCollapseOmniSingularityNodeIndex === composite.state.nationalCollapseOmniSingularityNodeIndex &&
      composite.persisted.lastVoidAbsoluteErosionSurgeIndex === composite.state.nationalVoidAbsoluteErosionSurgeIndex &&
      composite.persisted.lastExistentialFinalNullityLockIndex === composite.state.nationalExistentialFinalNullityLockIndex &&
      composite.persisted.lastCollapseTotalSingularityVertexIndex === composite.state.nationalCollapseTotalSingularityVertexIndex &&
      composite.persisted.lastVoidTerminalErosionCascadeIndex === composite.state.nationalVoidTerminalErosionCascadeIndex &&
      composite.persisted.lastExistentialUltimateNullitySealIndex === composite.state.nationalExistentialUltimateNullitySealIndex &&
      composite.persisted.lastCollapseAbsoluteSingularityApexIndex === composite.state.nationalCollapseAbsoluteSingularityApexIndex &&
      composite.persisted.lastVoidCompleteErosionTerminalityIndex === composite.state.nationalVoidCompleteErosionTerminalityIndex &&
      composite.persisted.lastExistentialFinalNullityClosureIndex === composite.state.nationalExistentialFinalNullityClosureIndex &&
      composite.persisted.lastCollapseUltimateSingularityZenithIndex === composite.state.nationalCollapseUltimateSingularityZenithIndex &&
      composite.persisted.lastVoidTotalErosionFinalityIndex === composite.state.nationalVoidTotalErosionFinalityIndex &&
      composite.persisted.lastExistentialAbsoluteNullityVerdictIndex === composite.state.nationalExistentialAbsoluteNullityVerdictIndex &&
      composite.persisted.lastCollapseTotalSingularityNexusIndex === composite.state.nationalCollapseTotalSingularityNexusIndex &&
      composite.persisted.lastVoidAbsoluteErosionTerminationIndex === composite.state.nationalVoidAbsoluteErosionTerminationIndex &&
      composite.persisted.lastExistentialFinalNullitySentenceIndex === composite.state.nationalExistentialFinalNullitySentenceIndex &&
      composite.persisted.lastCollapseAbsoluteSingularityCulminationIndex === composite.state.nationalCollapseAbsoluteSingularityCulminationIndex &&
      composite.persisted.lastVoidCompleteErosionExtinctionIndex === composite.state.nationalVoidCompleteErosionExtinctionIndex &&
      composite.persisted.lastExistentialTotalNullityDecreeIndex === composite.state.nationalExistentialTotalNullityDecreeIndex &&
      composite.persisted.lastCollapseOmniSingularitySynthesisIndex === composite.state.nationalCollapseOmniSingularitySynthesisIndex &&
      composite.persisted.lastVoidTotalErosionAnnihilationIndex === composite.state.nationalVoidTotalErosionAnnihilationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityMandateIndex === composite.state.nationalExistentialAbsoluteNullityMandateIndex &&
      composite.persisted.lastCollapseOmniSingularityConvergenceIndex === composite.state.nationalCollapseOmniSingularityConvergenceIndex &&
      composite.persisted.lastVoidTotalErosionObliterationIndex === composite.state.nationalVoidTotalErosionObliterationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityBindingIndex === composite.state.nationalExistentialAbsoluteNullityBindingIndex &&
      composite.persisted.lastCollapseOmniSingularityIntegrationIndex === composite.state.nationalCollapseOmniSingularityIntegrationIndex &&
      composite.persisted.lastVoidTotalErosionEradicationIndex === composite.state.nationalVoidTotalErosionEradicationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityContinuityIndex === composite.state.nationalExistentialAbsoluteNullityContinuityIndex &&
      composite.persisted.lastCollapseOmniSingularityUnificationIndex === composite.state.nationalCollapseOmniSingularityUnificationIndex &&
      composite.persisted.lastVoidTotalErosionEliminationIndex === composite.state.nationalVoidTotalErosionEliminationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityPerpetuityIndex === composite.state.nationalExistentialAbsoluteNullityPerpetuityIndex &&
      composite.persisted.lastCollapseOmniSingularityConsolidationIndex === composite.state.nationalCollapseOmniSingularityConsolidationIndex &&
      composite.persisted.lastVoidTotalErosionDissolutionIndex === composite.state.nationalVoidTotalErosionDissolutionIndex &&
      composite.persisted.lastExistentialAbsoluteNullityImmutabilityIndex === composite.state.nationalExistentialAbsoluteNullityImmutabilityIndex &&
      composite.persisted.lastCollapseOmniSingularityCoalescenceIndex === composite.state.nationalCollapseOmniSingularityCoalescenceIndex &&
      composite.persisted.lastVoidTotalErosionSublimationIndex === composite.state.nationalVoidTotalErosionSublimationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityPermanenceIndex === composite.state.nationalExistentialAbsoluteNullityPermanenceIndex &&
      composite.persisted.lastCollapseOmniSingularityAmalgamationIndex === composite.state.nationalCollapseOmniSingularityAmalgamationIndex &&
      composite.persisted.lastVoidTotalErosionAtomizationIndex === composite.state.nationalVoidTotalErosionAtomizationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityInevitabilityIndex === composite.state.nationalExistentialAbsoluteNullityInevitabilityIndex &&
      composite.persisted.lastCollapseOmniSingularitySymbiosisIndex === composite.state.nationalCollapseOmniSingularitySymbiosisIndex &&
      composite.persisted.lastVoidTotalErosionPulverizationIndex === composite.state.nationalVoidTotalErosionPulverizationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityDeterminismIndex === composite.state.nationalExistentialAbsoluteNullityDeterminismIndex &&
      composite.persisted.lastCollapseOmniSingularityHolismIndex === composite.state.nationalCollapseOmniSingularityHolismIndex &&
      composite.persisted.lastVoidTotalErosionGranulationIndex === composite.state.nationalVoidTotalErosionGranulationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityCertitudeIndex === composite.state.nationalExistentialAbsoluteNullityCertitudeIndex &&
      composite.persisted.lastCollapseOmniSingularityMonismIndex === composite.state.nationalCollapseOmniSingularityMonismIndex &&
      composite.persisted.lastVoidTotalErosionComminutionIndex === composite.state.nationalVoidTotalErosionComminutionIndex &&
      composite.persisted.lastExistentialAbsoluteNullityConvictionIndex === composite.state.nationalExistentialAbsoluteNullityConvictionIndex &&
      composite.persisted.lastCollapseOmniSingularityTotalismIndex === composite.state.nationalCollapseOmniSingularityTotalismIndex &&
      composite.persisted.lastVoidTotalErosionAttritionIndex === composite.state.nationalVoidTotalErosionAttritionIndex &&
      composite.persisted.lastExistentialAbsoluteNullityFinalityIndex === composite.state.nationalExistentialAbsoluteNullityFinalityIndex &&
      composite.persisted.lastCollapseOmniSingularityUniversalismIndex === composite.state.nationalCollapseOmniSingularityUniversalismIndex &&
      composite.persisted.lastVoidTotalErosionAblationIndex === composite.state.nationalVoidTotalErosionAblationIndex &&
      composite.persisted.lastExistentialAbsoluteNullitySealingIndex === composite.state.nationalExistentialAbsoluteNullitySealingIndex &&
      composite.persisted.lastCollapseOmniSingularityCosmismIndex === composite.state.nationalCollapseOmniSingularityCosmismIndex &&
      composite.persisted.lastVoidTotalErosionDepletionIndex === composite.state.nationalVoidTotalErosionDepletionIndex &&
      composite.persisted.lastExistentialAbsoluteNullityRatificationIndex === composite.state.nationalExistentialAbsoluteNullityRatificationIndex &&
      composite.persisted.lastCollapseOmniSingularityPantheismIndex === composite.state.nationalCollapseOmniSingularityPantheismIndex &&
      composite.persisted.lastVoidTotalErosionExhaustionIndex === composite.state.nationalVoidTotalErosionExhaustionIndex &&
      composite.persisted.lastExistentialAbsoluteNullityCanonizationIndex === composite.state.nationalExistentialAbsoluteNullityCanonizationIndex,
    `persisted cohesion ${composite.persisted.lastCohesionIndex} equity ${composite.persisted.lastServiceEquityIndex}`,
  );

  const absorption = composite.state.absorptionStress;
  push(
    out,
    'a11_37',
    absorption.length === 8 &&
      composite.state.metropolitanSaturationIndex === op10mA11NationalMetropolitanSaturation(absorption),
    `saturation ${composite.state.metropolitanSaturationIndex}`,
  );

  const serviceEq = op10mA11ComputeRegionalServiceEquity({
    settlement: composite.state.settlementVulnerability,
    fiscal: composite.state.fiscalUrbanCoupling,
  });
  push(
    out,
    'a11_38',
    composite.state.nationalServiceEquityIndex === serviceEq.nationalIndex &&
      composite.state.serviceEquity.every((s) => s.narrative.includes('service equity')),
    `service equity ${composite.state.nationalServiceEquityIndex}`,
  );

  push(
    out,
    'a11_39',
    composite.state.convergence.narrative.includes('standing spread') &&
      composite.persisted.lastStandingSpread === composite.state.convergence.standingSpread,
    composite.state.convergence.band,
  );

  push(
    out,
    'a11_40',
    composite.derived.some((d) => d.kind === 'absorption_capacity_breach') ||
      composite.state.absorptionStress.some((a) => a.band === 'strained' || a.band === 'breached'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_41',
    composite.derived.some((d) => d.kind === 'service_equity_gap') || serviceEq.rows[0].gapDrivers.length >= 1,
    composite.state.serviceEquity[0]?.band ?? 'none',
  );

  const spread = op10mA11StandingSpread(composite.state.urban.regions);
  const conv = op10mA11ComputeRegionalConvergence({
    regions: composite.state.urban.regions,
    priorStandingSpread: spread + 2,
  });
  push(
    out,
    'a11_42',
    conv.velocity !== 0 && composite.state.convergence.standingSpread === spread,
    `velocity sample ${conv.velocity}`,
  );

  push(
    out,
    'a11_43',
    validateOP10M_A11_CompositeState(composite.state).length === 0,
    'composite validation clean',
  );

  push(
    out,
    'a11_44',
    composite.derived.some((d) => d.kind === 'convergence_stall') || composite.state.convergence.band !== 'balanced',
    composite.state.convergence.band,
  );

  const periUrban = op10mA11ComputePeriUrbanExpansionPressure({
    cities: sampleCities,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_45',
    composite.state.periUrbanPressure.length === 8 &&
      composite.state.nationalPeriUrbanPressureIndex === op10mA11NationalPeriUrbanPressureIndex(periUrban),
    `peri-urban index ${composite.state.nationalPeriUrbanPressureIndex}`,
  );

  const backlog = op10mA11ComputeRegionalInfrastructureBacklog({
    bottlenecks: composite.state.infra.bottlenecks,
    absorptionStress: composite.state.absorptionStress,
    corridorStressIndex: composite.state.infra.corridorStressIndex,
  });
  push(
    out,
    'a11_46',
    composite.state.infrastructureBacklog.length === 8 &&
      composite.state.nationalInfrastructureBacklogIndex === backlog.nationalIndex,
    `backlog index ${composite.state.nationalInfrastructureBacklogIndex}`,
  );

  const governance = op10mA11ComputeMultiTierGovernanceFriction({
    national: inputs.national,
    reliefPlaybook: composite.state.reliefPlaybook,
    serviceEquity: composite.state.serviceEquity,
  });
  push(
    out,
    'a11_47',
    composite.state.governanceFriction.length === 8 &&
      composite.state.nationalGovernanceFrictionIndex === governance.nationalIndex,
    `governance friction ${composite.state.nationalGovernanceFrictionIndex}`,
  );

  push(
    out,
    'a11_48',
    composite.state.periUrbanPressure.every((p) => p.narrative.includes('peri-urban')),
    composite.state.periUrbanPressure[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_49',
    composite.derived.some((d) => d.kind === 'peri_urban_sprawl_pressure') ||
      composite.state.periUrbanPressure.some(
        (p) => p.band === 'expanding' || p.band === 'sprawl_risk' || p.band === 'unchecked',
      ),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_50',
    composite.derived.some((d) => d.kind === 'infrastructure_backlog_critical') ||
      composite.state.infrastructureBacklog.some((b) => b.band === 'severe' || b.band === 'critical'),
    composite.state.infrastructureBacklog[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_51',
    composite.persisted.lastGovernanceFrictionIndex === composite.state.nationalGovernanceFrictionIndex,
    `persisted governance ${composite.persisted.lastGovernanceFrictionIndex}`,
  );

  push(
    out,
    'a11_52',
    composite.derived.some((d) => d.kind === 'governance_coordination_breakdown') ||
      composite.state.governanceFriction.some(
        (g) => g.band === 'strained' || g.band === 'fragmented' || g.band === 'breakdown',
      ),
    composite.state.governanceFriction[0]?.band ?? 'none',
  );

  const housingSpill = op10mA11ComputeRegionalHousingSpilloverPressure({
    absorptionStress: composite.state.absorptionStress,
    periUrbanPressure: composite.state.periUrbanPressure,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_53',
    composite.state.housingSpillover.length === 8 &&
      composite.state.nationalHousingSpilloverIndex === housingSpill.nationalIndex,
    `housing spillover ${composite.state.nationalHousingSpilloverIndex}`,
  );

  const talent = op10mA11ComputeInterregionalTalentRetentionStress({
    migrationPressure: composite.state.migrationPressure,
    linkageHubs: composite.state.linkageHubs,
    fiscalUrbanCoupling: composite.state.fiscalUrbanCoupling,
  });
  push(
    out,
    'a11_54',
    composite.state.talentRetention.length === 8 && composite.state.nationalTalentDrainIndex === talent.nationalIndex,
    `talent drain ${composite.state.nationalTalentDrainIndex}`,
  );

  const climate = op10mA11ComputeClimateSettlementDisplacementRisk({
    settlementVulnerability: composite.state.settlementVulnerability,
    bottlenecks: composite.state.infra.bottlenecks,
    networkDigital: compositeIn.infra.networkDigital,
    corridorStressIndex: composite.state.infra.corridorStressIndex,
  });
  push(
    out,
    'a11_55',
    composite.state.climateDisplacement.length === 8 &&
      composite.state.nationalClimateDisplacementIndex === climate.nationalIndex,
    `climate displacement ${composite.state.nationalClimateDisplacementIndex}`,
  );

  push(
    out,
    'a11_56',
    composite.state.housingSpillover.every((h) => h.narrative.includes('housing spillover')),
    composite.state.housingSpillover[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_57',
    composite.derived.some((d) => d.kind === 'housing_spillover_cascade') ||
      composite.state.housingSpillover.some((h) => h.band === 'cascade' || h.band === 'systemic'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_58',
    composite.derived.some((d) => d.kind === 'regional_talent_drain') ||
      composite.state.talentRetention.some((t) => t.band === 'draining' || t.band === 'collapse'),
    composite.state.talentRetention[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_59',
    composite.persisted.lastHousingSpilloverIndex === composite.state.nationalHousingSpilloverIndex,
    `persisted spillover ${composite.persisted.lastHousingSpilloverIndex}`,
  );

  push(
    out,
    'a11_60',
    composite.derived.some((d) => d.kind === 'climate_displacement_exposure') ||
      composite.state.climateDisplacement.some((c) => c.band === 'acute' || c.band === 'critical'),
    composite.state.climateDisplacement[0]?.band ?? 'none',
  );

  const amenity = op10mA11ComputeRegionalAmenityCostPressure({
    housingSpillover: composite.state.housingSpillover,
    talentRetention: composite.state.talentRetention,
    fiscalUrbanCoupling: composite.state.fiscalUrbanCoupling,
  });
  push(
    out,
    'a11_61',
    composite.state.amenityCost.length === 8 && composite.state.nationalAmenityCostIndex === amenity.nationalIndex,
    `amenity cost ${composite.state.nationalAmenityCostIndex}`,
  );

  const decentral = op10mA11ComputeDigitalConnectivityDecentralizationShift({
    networkDigital: inputs.national.networkDigital,
    migrationPressure: composite.state.migrationPressure,
    linkageHubs: composite.state.linkageHubs,
    hierarchy: composite.state.hierarchy,
  });
  push(
    out,
    'a11_62',
    composite.state.decentralizationShift.length === 8 &&
      composite.state.nationalDecentralizationIndex === decentral.nationalIndex,
    `decentralization ${composite.state.nationalDecentralizationIndex}`,
  );

  const relocation = op10mA11ComputeSettlementRelocationBurden({
    climateDisplacement: composite.state.climateDisplacement,
    governanceFriction: composite.state.governanceFriction,
    housingSpillover: composite.state.housingSpillover,
  });
  push(
    out,
    'a11_63',
    composite.state.relocationBurden.length === 8 &&
      composite.state.nationalRelocationBurdenIndex === relocation.nationalIndex,
    `relocation burden ${composite.state.nationalRelocationBurdenIndex}`,
  );

  push(
    out,
    'a11_64',
    composite.state.amenityCost.every((a) => a.narrative.includes('amenity cost')),
    composite.state.amenityCost[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_65',
    composite.derived.some((d) => d.kind === 'amenity_cost_spiral') ||
      composite.state.amenityCost.some((a) => a.band === 'strained' || a.band === 'crisis'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_66',
    composite.derived.some((d) => d.kind === 'digital_decentralization_pulse') ||
      composite.state.decentralizationShift.some((d) => d.band === 'broadening' || d.band === 'accelerating'),
    composite.state.decentralizationShift[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_67',
    composite.persisted.lastAmenityCostIndex === composite.state.nationalAmenityCostIndex,
    `persisted amenity ${composite.persisted.lastAmenityCostIndex}`,
  );

  push(
    out,
    'a11_68',
    composite.derived.some((d) => d.kind === 'settlement_relocation_burden') ||
      composite.state.relocationBurden.some((r) => r.band === 'severe' || r.band === 'overwhelming'),
    composite.state.relocationBurden[0]?.band ?? 'none',
  );

  const employmentAnchor = op10mA11ComputeRegionalEmploymentAnchorStress({
    decentralizationShift: composite.state.decentralizationShift,
    talentRetention: composite.state.talentRetention,
    linkageHubs: composite.state.linkageHubs,
  });
  push(
    out,
    'a11_69',
    composite.state.employmentAnchor.length === 8 &&
      composite.state.nationalEmploymentAnchorIndex === employmentAnchor.nationalIndex,
    `employment anchor ${composite.state.nationalEmploymentAnchorIndex}`,
  );

  const commuteWedge = op10mA11ComputeInterregionalCommuteAffordabilityWedge({
    amenityCost: composite.state.amenityCost,
    periUrbanPressure: composite.state.periUrbanPressure,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_70',
    composite.state.commuteWedge.length === 8 &&
      composite.state.nationalCommuteWedgeIndex === commuteWedge.nationalIndex,
    `commute wedge ${composite.state.nationalCommuteWedgeIndex}`,
  );

  const receptionStrain = op10mA11ComputeSettlementReceptionCapacityStrain({
    relocationBurden: composite.state.relocationBurden,
    absorptionStress: composite.state.absorptionStress,
    serviceEquity: composite.state.serviceEquity,
  });
  push(
    out,
    'a11_71',
    composite.state.receptionStrain.length === 8 &&
      composite.state.nationalReceptionStrainIndex === receptionStrain.nationalIndex,
    `reception strain ${composite.state.nationalReceptionStrainIndex}`,
  );

  push(
    out,
    'a11_72',
    composite.state.employmentAnchor.every((e) => e.narrative.includes('employment anchor')),
    composite.state.employmentAnchor[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_73',
    composite.derived.some((d) => d.kind === 'employment_anchor_fragility') ||
      composite.state.employmentAnchor.some((e) => e.band === 'fragile' || e.band === 'collapsing'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_74',
    composite.derived.some((d) => d.kind === 'commute_affordability_wedge') ||
      composite.state.commuteWedge.some((c) => c.band === 'severe' || c.band === 'unsustainable'),
    composite.state.commuteWedge[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_75',
    composite.persisted.lastEmploymentAnchorIndex === composite.state.nationalEmploymentAnchorIndex,
    `persisted anchor ${composite.persisted.lastEmploymentAnchorIndex}`,
  );

  push(
    out,
    'a11_76',
    composite.derived.some((d) => d.kind === 'settlement_reception_strain') ||
      composite.state.receptionStrain.some((r) => r.band === 'strained' || r.band === 'saturated'),
    composite.state.receptionStrain[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_77',
    composite.state.commuteWedge.every((c) => c.narrative.includes('commute affordability wedge')),
    composite.state.commuteWedge[0]?.band ?? 'none',
  );

  const landUseGridlock = op10mA11ComputeRegionalLandUseRegulatoryGridlock({
    governanceFriction: composite.state.governanceFriction,
    periUrbanPressure: composite.state.periUrbanPressure,
    housingSpillover: composite.state.housingSpillover,
  });
  push(
    out,
    'a11_78',
    composite.state.landUseGridlock.length === 8 &&
      composite.state.nationalLandUseGridlockIndex === landUseGridlock.nationalIndex,
    `land-use gridlock ${composite.state.nationalLandUseGridlockIndex}`,
  );

  const mobilityTrap = op10mA11ComputeInterregionalMobilityAffordabilityTrap({
    commuteWedge: composite.state.commuteWedge,
    migrationPressure: composite.state.migrationPressure,
    amenityCost: composite.state.amenityCost,
  });
  push(
    out,
    'a11_79',
    composite.state.mobilityTrap.length === 8 &&
      composite.state.nationalMobilityTrapIndex === mobilityTrap.nationalIndex,
    `mobility trap ${composite.state.nationalMobilityTrapIndex}`,
  );

  const absorptionGap = op10mA11ComputeSettlementInfrastructureAbsorptionGap({
    infrastructureBacklog: composite.state.infrastructureBacklog,
    receptionStrain: composite.state.receptionStrain,
    absorptionStress: composite.state.absorptionStress,
  });
  push(
    out,
    'a11_80',
    composite.state.absorptionGap.length === 8 &&
      composite.state.nationalAbsorptionGapIndex === absorptionGap.nationalIndex,
    `absorption gap ${composite.state.nationalAbsorptionGapIndex}`,
  );

  push(
    out,
    'a11_81',
    composite.state.landUseGridlock.every((l) => l.narrative.includes('land-use regulatory')),
    composite.state.landUseGridlock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_82',
    composite.derived.some((d) => d.kind === 'land_use_regulatory_gridlock') ||
      composite.state.landUseGridlock.some((l) => l.band === 'gridlocked' || l.band === 'paralyzed'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_83',
    composite.derived.some((d) => d.kind === 'mobility_affordability_trap') ||
      composite.state.mobilityTrap.some((m) => m.band === 'trapped' || m.band === 'immobilized'),
    composite.state.mobilityTrap[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_84',
    composite.persisted.lastLandUseGridlockIndex === composite.state.nationalLandUseGridlockIndex,
    `persisted gridlock ${composite.persisted.lastLandUseGridlockIndex}`,
  );

  push(
    out,
    'a11_85',
    composite.derived.some((d) => d.kind === 'infrastructure_absorption_gap') ||
      composite.state.absorptionGap.some((g) => g.band === 'critical' || g.band === 'rupture'),
    composite.state.absorptionGap[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_86',
    composite.state.mobilityTrap.every((m) => m.narrative.includes('mobility affordability')),
    composite.state.mobilityTrap[0]?.band ?? 'none',
  );

  const reliefOverhead = op10mA11ComputeRegionalReliefCoordinationOverhead({
    reliefPlaybook: composite.state.reliefPlaybook,
    governanceFriction: composite.state.governanceFriction,
    receptionStrain: composite.state.receptionStrain,
  });
  push(
    out,
    'a11_87',
    composite.state.reliefOverhead.length === 8 &&
      composite.state.nationalReliefOverheadIndex === reliefOverhead.nationalIndex,
    `relief overhead ${composite.state.nationalReliefOverheadIndex}`,
  );

  const corridorDrift = op10mA11ComputeInterregionalCorridorEquityDrift({
    corridorFlows: composite.state.corridorFlows,
    serviceEquity: composite.state.serviceEquity,
    commuteWedge: composite.state.commuteWedge,
  });
  push(
    out,
    'a11_88',
    composite.state.corridorEquityDrift.length === 8 &&
      composite.state.nationalCorridorEquityDriftIndex === corridorDrift.nationalIndex,
    `corridor drift ${composite.state.nationalCorridorEquityDriftIndex}`,
  );

  const adaptationLag = op10mA11ComputeSettlementClimateAdaptationLag({
    climateDisplacement: composite.state.climateDisplacement,
    absorptionGap: composite.state.absorptionGap,
    infrastructureBacklog: composite.state.infrastructureBacklog,
  });
  push(
    out,
    'a11_89',
    composite.state.climateAdaptationLag.length === 8 &&
      composite.state.nationalClimateAdaptationLagIndex === adaptationLag.nationalIndex,
    `adaptation lag ${composite.state.nationalClimateAdaptationLagIndex}`,
  );

  push(
    out,
    'a11_90',
    composite.state.reliefOverhead.every((r) => r.narrative.includes('relief coordination')),
    composite.state.reliefOverhead[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_91',
    composite.derived.some((d) => d.kind === 'relief_coordination_overhead') ||
      composite.state.reliefOverhead.some((r) => r.band === 'overloaded' || r.band === 'paralytic'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_92',
    composite.derived.some((d) => d.kind === 'corridor_equity_drift') ||
      composite.state.corridorEquityDrift.some((c) => c.band === 'polarized' || c.band === 'fractured'),
    composite.state.corridorEquityDrift[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_93',
    composite.persisted.lastReliefOverheadIndex === composite.state.nationalReliefOverheadIndex,
    `persisted relief ${composite.persisted.lastReliefOverheadIndex}`,
  );

  push(
    out,
    'a11_94',
    composite.derived.some((d) => d.kind === 'climate_adaptation_lag') ||
      composite.state.climateAdaptationLag.some((a) => a.band === 'stalled' || a.band === 'critical_lag'),
    composite.state.climateAdaptationLag[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_95',
    composite.state.corridorEquityDrift.every((c) => c.narrative.includes('corridor equity')),
    composite.state.corridorEquityDrift[0]?.band ?? 'none',
  );

  const fiscalCapacity = op10mA11ComputeRegionalFiscalCapacityStrain({
    fiscalUrbanCoupling: composite.state.fiscalUrbanCoupling,
    reliefOverhead: composite.state.reliefOverhead,
    governanceFriction: composite.state.governanceFriction,
  });
  push(
    out,
    'a11_96',
    composite.state.fiscalCapacityStrain.length === 8 &&
      composite.state.nationalFiscalCapacityStrainIndex === fiscalCapacity.nationalIndex,
    `fiscal capacity ${composite.state.nationalFiscalCapacityStrainIndex}`,
  );

  const networkErosion = op10mA11ComputeInterregionalNetworkResilienceErosion({
    linkageHubs: composite.state.linkageHubs,
    corridorEquityDrift: composite.state.corridorEquityDrift,
    infrastructureBacklog: composite.state.infrastructureBacklog,
    fragilityIndex: composite.state.fragilityIndex,
  });
  push(
    out,
    'a11_97',
    composite.state.networkResilienceErosion.length === 8 &&
      composite.state.nationalNetworkResilienceErosionIndex === networkErosion.nationalIndex,
    `network erosion ${composite.state.nationalNetworkResilienceErosionIndex}`,
  );

  const horizonRisk = op10mA11ComputeSettlementLongHorizonCapacityRisk({
    climateAdaptationLag: composite.state.climateAdaptationLag,
    mobilityTrap: composite.state.mobilityTrap,
    convergence: composite.state.convergence,
  });
  push(
    out,
    'a11_98',
    composite.state.longHorizonCapacityRisk.length === 8 &&
      composite.state.nationalLongHorizonCapacityRiskIndex === horizonRisk.nationalIndex,
    `horizon risk ${composite.state.nationalLongHorizonCapacityRiskIndex}`,
  );

  push(
    out,
    'a11_99',
    composite.state.fiscalCapacityStrain.every((f) => f.narrative.includes('fiscal capacity')),
    composite.state.fiscalCapacityStrain[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_100',
    composite.derived.some((d) => d.kind === 'fiscal_capacity_strain') ||
      composite.state.fiscalCapacityStrain.some((f) => f.band === 'fragile' || f.band === 'exhausted'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_101',
    composite.derived.some((d) => d.kind === 'network_resilience_erosion') ||
      composite.state.networkResilienceErosion.some((n) => n.band === 'eroding' || n.band === 'fracturing'),
    composite.state.networkResilienceErosion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_102',
    composite.persisted.lastFiscalCapacityStrainIndex === composite.state.nationalFiscalCapacityStrainIndex,
    `persisted fiscal ${composite.persisted.lastFiscalCapacityStrainIndex}`,
  );

  push(
    out,
    'a11_103',
    composite.derived.some((d) => d.kind === 'long_horizon_capacity_risk') ||
      composite.state.longHorizonCapacityRisk.some((h) => h.band === 'acute' || h.band === 'critical'),
    composite.state.longHorizonCapacityRisk[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_104',
    composite.state.networkResilienceErosion.every((n) => n.narrative.includes('network resilience')),
    composite.state.networkResilienceErosion[0]?.band ?? 'none',
  );

  const cohesionIntegrity = op10mA11ComputeRegionalCohesionIntegrityPressure({
    regionalCohesionIndex: composite.state.regionalCohesionIndex,
    networkResilienceErosion: composite.state.networkResilienceErosion,
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
  });
  push(
    out,
    'a11_105',
    composite.state.cohesionIntegrity.length === 8 &&
      composite.state.nationalCohesionIntegrityIndex === cohesionIntegrity.nationalIndex,
    `cohesion integrity ${composite.state.nationalCohesionIntegrityIndex}`,
  );

  const reliefEquityGap = op10mA11ComputeInterregionalReliefDeliveryEquityGap({
    reliefOverhead: composite.state.reliefOverhead,
    corridorEquityDrift: composite.state.corridorEquityDrift,
    serviceEquity: composite.state.serviceEquity,
  });
  push(
    out,
    'a11_106',
    composite.state.reliefEquityGap.length === 8 &&
      composite.state.nationalReliefEquityGapIndex === reliefEquityGap.nationalIndex,
    `relief equity gap ${composite.state.nationalReliefEquityGapIndex}`,
  );

  const systemicFragility = op10mA11ComputeSettlementSystemicFragilityComposite({
    longHorizonCapacityRisk: composite.state.longHorizonCapacityRisk,
    landUseGridlock: composite.state.landUseGridlock,
    relocationBurden: composite.state.relocationBurden,
  });
  push(
    out,
    'a11_107',
    composite.state.systemicFragility.length === 8 &&
      composite.state.nationalSystemicFragilityIndex === systemicFragility.nationalIndex,
    `systemic fragility ${composite.state.nationalSystemicFragilityIndex}`,
  );

  push(
    out,
    'a11_108',
    composite.state.cohesionIntegrity.every((c) => c.narrative.includes('cohesion integrity')),
    composite.state.cohesionIntegrity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_109',
    composite.derived.some((d) => d.kind === 'cohesion_integrity_stress') ||
      composite.state.cohesionIntegrity.some((c) => c.band === 'fractured' || c.band === 'disintegrating'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_110',
    composite.derived.some((d) => d.kind === 'relief_delivery_equity_gap') ||
      composite.state.reliefEquityGap.some((r) => r.band === 'skewed' || r.band === 'polarized'),
    composite.state.reliefEquityGap[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_111',
    composite.persisted.lastCohesionIntegrityIndex === composite.state.nationalCohesionIntegrityIndex,
    `persisted integrity ${composite.persisted.lastCohesionIntegrityIndex}`,
  );

  push(
    out,
    'a11_112',
    composite.derived.some((d) => d.kind === 'systemic_settlement_fragility') ||
      composite.state.systemicFragility.some((s) => s.band === 'systemic' || s.band === 'cascade_risk'),
    composite.state.systemicFragility[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_113',
    composite.state.systemicFragility.every((s) => s.narrative.includes('systemic fragility')),
    composite.state.systemicFragility[0]?.band ?? 'none',
  );

  const governanceDecay = op10mA11ComputeRegionalGovernanceResilienceDecay({
    governanceFriction: composite.state.governanceFriction,
    systemicFragility: composite.state.systemicFragility,
    reliefEquityGap: composite.state.reliefEquityGap,
  });
  push(
    out,
    'a11_114',
    composite.state.governanceResilienceDecay.length === 8 &&
      composite.state.nationalGovernanceResilienceDecayIndex === governanceDecay.nationalIndex,
    `governance decay ${composite.state.nationalGovernanceResilienceDecayIndex}`,
  );

  const migrationStability = op10mA11ComputeInterregionalMigrationStabilityErosion({
    migrationPressure: composite.state.migrationPressure,
    mobilityTrap: composite.state.mobilityTrap,
    cohesionIntegrity: composite.state.cohesionIntegrity,
  });
  push(
    out,
    'a11_115',
    composite.state.migrationStabilityErosion.length === 8 &&
      composite.state.nationalMigrationStabilityErosionIndex === migrationStability.nationalIndex,
    `migration stability ${composite.state.nationalMigrationStabilityErosionIndex}`,
  );

  const adaptiveCeiling = op10mA11ComputeSettlementAdaptiveCapacityCeiling({
    climateAdaptationLag: composite.state.climateAdaptationLag,
    receptionStrain: composite.state.receptionStrain,
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
  });
  push(
    out,
    'a11_116',
    composite.state.adaptiveCapacityCeiling.length === 8 &&
      composite.state.nationalAdaptiveCapacityCeilingIndex === adaptiveCeiling.nationalIndex,
    `adaptive ceiling ${composite.state.nationalAdaptiveCapacityCeilingIndex}`,
  );

  push(
    out,
    'a11_117',
    composite.state.governanceResilienceDecay.every((g) => g.narrative.includes('governance resilience')),
    composite.state.governanceResilienceDecay[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_118',
    composite.derived.some((d) => d.kind === 'governance_resilience_decay') ||
      composite.state.governanceResilienceDecay.some((g) => g.band === 'brittle' || g.band === 'collapsed'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_119',
    composite.derived.some((d) => d.kind === 'migration_stability_erosion') ||
      composite.state.migrationStabilityErosion.some((m) => m.band === 'unstable' || m.band === 'chaotic'),
    composite.state.migrationStabilityErosion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_120',
    composite.persisted.lastGovernanceResilienceDecayIndex === composite.state.nationalGovernanceResilienceDecayIndex,
    `persisted decay ${composite.persisted.lastGovernanceResilienceDecayIndex}`,
  );

  push(
    out,
    'a11_121',
    composite.derived.some((d) => d.kind === 'adaptive_capacity_ceiling') ||
      composite.state.adaptiveCapacityCeiling.some((a) => a.band === 'capped' || a.band === 'breached'),
    composite.state.adaptiveCapacityCeiling[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_122',
    composite.state.migrationStabilityErosion.every((m) => m.narrative.includes('migration stability')),
    composite.state.migrationStabilityErosion[0]?.band ?? 'none',
  );

  const fiscalGovernanceCoupling = op10mA11ComputeRegionalFiscalGovernanceCouplingStrain({
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
    governanceResilienceDecay: composite.state.governanceResilienceDecay,
    cohesionIntegrity: composite.state.cohesionIntegrity,
  });
  push(
    out,
    'a11_123',
    composite.state.fiscalGovernanceCoupling.length === 8 &&
      composite.state.nationalFiscalGovernanceCouplingIndex === fiscalGovernanceCoupling.nationalIndex,
    `fiscal–governance coupling ${composite.state.nationalFiscalGovernanceCouplingIndex}`,
  );

  const networkEquityTension = op10mA11ComputeInterregionalNetworkEquityTension({
    networkResilienceErosion: composite.state.networkResilienceErosion,
    reliefEquityGap: composite.state.reliefEquityGap,
    corridorEquityDrift: composite.state.corridorEquityDrift,
  });
  push(
    out,
    'a11_124',
    composite.state.networkEquityTension.length === 8 &&
      composite.state.nationalNetworkEquityTensionIndex === networkEquityTension.nationalIndex,
    `network equity tension ${composite.state.nationalNetworkEquityTensionIndex}`,
  );

  const resilienceFrontier = op10mA11ComputeSettlementResilienceFrontierPressure({
    systemicFragility: composite.state.systemicFragility,
    adaptiveCapacityCeiling: composite.state.adaptiveCapacityCeiling,
    longHorizonCapacityRisk: composite.state.longHorizonCapacityRisk,
  });
  push(
    out,
    'a11_125',
    composite.state.resilienceFrontier.length === 8 &&
      composite.state.nationalResilienceFrontierIndex === resilienceFrontier.nationalIndex,
    `resilience frontier ${composite.state.nationalResilienceFrontierIndex}`,
  );

  push(
    out,
    'a11_126',
    composite.state.fiscalGovernanceCoupling.every((f) => f.narrative.includes('fiscal–governance coupling')),
    composite.state.fiscalGovernanceCoupling[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_127',
    composite.derived.some((d) => d.kind === 'fiscal_governance_coupling_strain') ||
      composite.state.fiscalGovernanceCoupling.some((f) => f.band === 'misaligned' || f.band === 'ruptured'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_128',
    composite.derived.some((d) => d.kind === 'network_equity_tension') ||
      composite.state.networkEquityTension.some((n) => n.band === 'polarized' || n.band === 'fractured'),
    composite.state.networkEquityTension[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_129',
    composite.persisted.lastNetworkEquityTensionIndex === composite.state.nationalNetworkEquityTensionIndex,
    `persisted network equity ${composite.persisted.lastNetworkEquityTensionIndex}`,
  );

  push(
    out,
    'a11_130',
    composite.derived.some((d) => d.kind === 'resilience_frontier_pressure') ||
      composite.state.resilienceFrontier.some((r) => r.band === 'at_limit' || r.band === 'breached'),
    composite.state.resilienceFrontier[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_131',
    composite.state.resilienceFrontier.every((r) => r.narrative.includes('resilience frontier')),
    composite.state.resilienceFrontier[0]?.band ?? 'none',
  );

  const metaGovernanceFatigue = op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue({
    fiscalGovernanceCoupling: composite.state.fiscalGovernanceCoupling,
    governanceFriction: composite.state.governanceFriction,
    reliefOverhead: composite.state.reliefOverhead,
  });
  push(
    out,
    'a11_132',
    composite.state.metaGovernanceFatigue.length === 8 &&
      composite.state.nationalMetaGovernanceFatigueIndex === metaGovernanceFatigue.nationalIndex,
    `meta-governance fatigue ${composite.state.nationalMetaGovernanceFatigueIndex}`,
  );

  const capitalMobilityAsymmetry = op10mA11ComputeInterregionalCapitalMobilityAsymmetry({
    networkEquityTension: composite.state.networkEquityTension,
    fiscalGovernanceCoupling: composite.state.fiscalGovernanceCoupling,
    corridorEquityDrift: composite.state.corridorEquityDrift,
  });
  push(
    out,
    'a11_133',
    composite.state.capitalMobilityAsymmetry.length === 8 &&
      composite.state.nationalCapitalMobilityAsymmetryIndex === capitalMobilityAsymmetry.nationalIndex,
    `capital mobility ${composite.state.nationalCapitalMobilityAsymmetryIndex}`,
  );

  const compoundShockSaturation = op10mA11ComputeSettlementCompoundShockSaturation({
    resilienceFrontier: composite.state.resilienceFrontier,
    systemicFragility: composite.state.systemicFragility,
    migrationStabilityErosion: composite.state.migrationStabilityErosion,
  });
  push(
    out,
    'a11_134',
    composite.state.compoundShockSaturation.length === 8 &&
      composite.state.nationalCompoundShockSaturationIndex === compoundShockSaturation.nationalIndex,
    `compound shocks ${composite.state.nationalCompoundShockSaturationIndex}`,
  );

  push(
    out,
    'a11_135',
    composite.state.metaGovernanceFatigue.every((m) => m.narrative.includes('meta-governance coordination')),
    composite.state.metaGovernanceFatigue[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_136',
    composite.derived.some((d) => d.kind === 'meta_governance_coordination_fatigue') ||
      composite.state.metaGovernanceFatigue.some((m) => m.band === 'fatigued' || m.band === 'exhausted'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_137',
    composite.derived.some((d) => d.kind === 'capital_mobility_asymmetry') ||
      composite.state.capitalMobilityAsymmetry.some((c) => c.band === 'polarized' || c.band === 'locked'),
    composite.state.capitalMobilityAsymmetry[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_138',
    composite.persisted.lastCompoundShockSaturationIndex === composite.state.nationalCompoundShockSaturationIndex,
    `persisted compound shocks ${composite.persisted.lastCompoundShockSaturationIndex}`,
  );

  push(
    out,
    'a11_139',
    composite.derived.some((d) => d.kind === 'compound_shock_saturation') ||
      composite.state.compoundShockSaturation.some((s) => s.band === 'saturated' || s.band === 'overwhelmed'),
    composite.state.compoundShockSaturation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_140',
    composite.state.capitalMobilityAsymmetry.every((c) => c.narrative.includes('capital mobility asymmetry')),
    composite.state.capitalMobilityAsymmetry[0]?.band ?? 'none',
  );

  const institutionalTrustErosion = op10mA11ComputeRegionalInstitutionalTrustErosion({
    metaGovernanceFatigue: composite.state.metaGovernanceFatigue,
    governanceResilienceDecay: composite.state.governanceResilienceDecay,
    cohesionIntegrity: composite.state.cohesionIntegrity,
  });
  push(
    out,
    'a11_141',
    composite.state.institutionalTrustErosion.length === 8 &&
      composite.state.nationalInstitutionalTrustErosionIndex === institutionalTrustErosion.nationalIndex,
    `institutional trust ${composite.state.nationalInstitutionalTrustErosionIndex}`,
  );

  const liquidityFragmentation = op10mA11ComputeInterregionalLiquidityFragmentationStress({
    capitalMobilityAsymmetry: composite.state.capitalMobilityAsymmetry,
    networkEquityTension: composite.state.networkEquityTension,
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
  });
  push(
    out,
    'a11_142',
    composite.state.liquidityFragmentation.length === 8 &&
      composite.state.nationalLiquidityFragmentationIndex === liquidityFragmentation.nationalIndex,
    `liquidity fragmentation ${composite.state.nationalLiquidityFragmentationIndex}`,
  );

  const cascadingFailureRisk = op10mA11ComputeSettlementCascadingFailureRisk({
    compoundShockSaturation: composite.state.compoundShockSaturation,
    systemicFragility: composite.state.systemicFragility,
    adaptiveCapacityCeiling: composite.state.adaptiveCapacityCeiling,
  });
  push(
    out,
    'a11_143',
    composite.state.cascadingFailureRisk.length === 8 &&
      composite.state.nationalCascadingFailureRiskIndex === cascadingFailureRisk.nationalIndex,
    `cascade risk ${composite.state.nationalCascadingFailureRiskIndex}`,
  );

  push(
    out,
    'a11_144',
    composite.state.institutionalTrustErosion.every((t) => t.narrative.includes('institutional trust erosion')),
    composite.state.institutionalTrustErosion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_145',
    composite.derived.some((d) => d.kind === 'institutional_trust_erosion') ||
      composite.state.institutionalTrustErosion.some((t) => t.band === 'brittle' || t.band === 'breakdown'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_146',
    composite.derived.some((d) => d.kind === 'liquidity_fragmentation_stress') ||
      composite.state.liquidityFragmentation.some((l) => l.band === 'fractured' || l.band === 'frozen'),
    composite.state.liquidityFragmentation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_147',
    composite.persisted.lastLiquidityFragmentationIndex === composite.state.nationalLiquidityFragmentationIndex,
    `persisted liquidity ${composite.persisted.lastLiquidityFragmentationIndex}`,
  );

  push(
    out,
    'a11_148',
    composite.derived.some((d) => d.kind === 'cascading_failure_risk') ||
      composite.state.cascadingFailureRisk.some((c) => c.band === 'cascade_risk' || c.band === 'systemic'),
    composite.state.cascadingFailureRisk[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_149',
    composite.state.cascadingFailureRisk.every((c) => c.narrative.includes('cascading failure risk')),
    composite.state.cascadingFailureRisk[0]?.band ?? 'none',
  );

  const socialContractFragility = op10mA11ComputeRegionalSocialContractFragility({
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
    liquidityFragmentation: composite.state.liquidityFragmentation,
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
  });
  push(
    out,
    'a11_150',
    composite.state.socialContractFragility.length === 8 &&
      composite.state.nationalSocialContractFragilityIndex === socialContractFragility.nationalIndex,
    `social contract ${composite.state.nationalSocialContractFragilityIndex}`,
  );

  const capitalFlightPanic = op10mA11ComputeInterregionalCapitalFlightPanic({
    liquidityFragmentation: composite.state.liquidityFragmentation,
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
    capitalMobilityAsymmetry: composite.state.capitalMobilityAsymmetry,
  });
  push(
    out,
    'a11_151',
    composite.state.capitalFlightPanic.length === 8 &&
      composite.state.nationalCapitalFlightPanicIndex === capitalFlightPanic.nationalIndex,
    `capital flight ${composite.state.nationalCapitalFlightPanicIndex}`,
  );

  const irrecoverableCollapse = op10mA11ComputeSettlementIrrecoverableCollapseThreshold({
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
    compoundShockSaturation: composite.state.compoundShockSaturation,
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
  });
  push(
    out,
    'a11_152',
    composite.state.irrecoverableCollapseThreshold.length === 8 &&
      composite.state.nationalIrrecoverableCollapseThresholdIndex === irrecoverableCollapse.nationalIndex,
    `collapse threshold ${composite.state.nationalIrrecoverableCollapseThresholdIndex}`,
  );

  push(
    out,
    'a11_153',
    composite.state.socialContractFragility.every((s) => s.narrative.includes('social contract fragility')),
    composite.state.socialContractFragility[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_154',
    composite.derived.some((d) => d.kind === 'social_contract_fragility') ||
      composite.state.socialContractFragility.some((s) => s.band === 'fraying' || s.band === 'ruptured'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_155',
    composite.derived.some((d) => d.kind === 'capital_flight_panic') ||
      composite.state.capitalFlightPanic.some((c) => c.band === 'panicked' || c.band === 'stampede'),
    composite.state.capitalFlightPanic[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_156',
    composite.persisted.lastCapitalFlightPanicIndex === composite.state.nationalCapitalFlightPanicIndex,
    `persisted capital flight ${composite.persisted.lastCapitalFlightPanicIndex}`,
  );

  push(
    out,
    'a11_157',
    composite.derived.some((d) => d.kind === 'irrecoverable_collapse_threshold') ||
      composite.state.irrecoverableCollapseThreshold.some((i) => i.band === 'terminal' || i.band === 'irrecoverable'),
    composite.state.irrecoverableCollapseThreshold[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_158',
    composite.state.irrecoverableCollapseThreshold.every((i) => i.narrative.includes('irrecoverable collapse threshold')),
    composite.state.irrecoverableCollapseThreshold[0]?.band ?? 'none',
  );

  const settlementLegitimacyCollapse = op10mA11ComputeRegionalSettlementLegitimacyCollapse({
    socialContractFragility: composite.state.socialContractFragility,
    capitalFlightPanic: composite.state.capitalFlightPanic,
    irrecoverableCollapseThreshold: composite.state.irrecoverableCollapseThreshold,
  });
  push(
    out,
    'a11_159',
    composite.state.settlementLegitimacyCollapse.length === 8 &&
      composite.state.nationalSettlementLegitimacyCollapseIndex === settlementLegitimacyCollapse.nationalIndex,
    `legitimacy collapse ${composite.state.nationalSettlementLegitimacyCollapseIndex}`,
  );

  const fiscalPanicContagion = op10mA11ComputeInterregionalFiscalPanicContagion({
    capitalFlightPanic: composite.state.capitalFlightPanic,
    liquidityFragmentation: composite.state.liquidityFragmentation,
    socialContractFragility: composite.state.socialContractFragility,
  });
  push(
    out,
    'a11_160',
    composite.state.fiscalPanicContagion.length === 8 &&
      composite.state.nationalFiscalPanicContagionIndex === fiscalPanicContagion.nationalIndex,
    `fiscal contagion ${composite.state.nationalFiscalPanicContagionIndex}`,
  );

  const terminalStateLockIn = op10mA11ComputeSettlementTerminalStateLockIn({
    irrecoverableCollapseThreshold: composite.state.irrecoverableCollapseThreshold,
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
    socialContractFragility: composite.state.socialContractFragility,
  });
  push(
    out,
    'a11_161',
    composite.state.terminalStateLockIn.length === 8 &&
      composite.state.nationalTerminalStateLockInIndex === terminalStateLockIn.nationalIndex,
    `terminal lock-in ${composite.state.nationalTerminalStateLockInIndex}`,
  );

  push(
    out,
    'a11_162',
    composite.state.settlementLegitimacyCollapse.every((s) => s.narrative.includes('settlement legitimacy collapse')),
    composite.state.settlementLegitimacyCollapse[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_163',
    composite.derived.some((d) => d.kind === 'settlement_legitimacy_collapse') ||
      composite.state.settlementLegitimacyCollapse.some((s) => s.band === 'delegitimized' || s.band === 'collapsed'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_164',
    composite.derived.some((d) => d.kind === 'fiscal_panic_contagion') ||
      composite.state.fiscalPanicContagion.some((f) => f.band === 'contagion' || f.band === 'systemic'),
    composite.state.fiscalPanicContagion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_165',
    composite.persisted.lastFiscalPanicContagionIndex === composite.state.nationalFiscalPanicContagionIndex,
    `persisted fiscal contagion ${composite.persisted.lastFiscalPanicContagionIndex}`,
  );

  push(
    out,
    'a11_166',
    composite.derived.some((d) => d.kind === 'terminal_state_lock_in') ||
      composite.state.terminalStateLockIn.some((t) => t.band === 'locked' || t.band === 'terminal'),
    composite.state.terminalStateLockIn[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_167',
    composite.state.terminalStateLockIn.every((t) => t.narrative.includes('terminal state lock-in')),
    composite.state.terminalStateLockIn[0]?.band ?? 'none',
  );

  const governanceVacuumEscalation = op10mA11ComputeRegionalGovernanceVacuumEscalation({
    settlementLegitimacyCollapse: composite.state.settlementLegitimacyCollapse,
    fiscalPanicContagion: composite.state.fiscalPanicContagion,
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
  });
  push(
    out,
    'a11_168',
    composite.state.governanceVacuumEscalation.length === 8 &&
      composite.state.nationalGovernanceVacuumEscalationIndex === governanceVacuumEscalation.nationalIndex,
    `governance vacuum ${composite.state.nationalGovernanceVacuumEscalationIndex}`,
  );

  const settlementAbandonmentSpiral = op10mA11ComputeInterregionalSettlementAbandonmentSpiral({
    terminalStateLockIn: composite.state.terminalStateLockIn,
    irrecoverableCollapseThreshold: composite.state.irrecoverableCollapseThreshold,
    capitalFlightPanic: composite.state.capitalFlightPanic,
  });
  push(
    out,
    'a11_169',
    composite.state.settlementAbandonmentSpiral.length === 8 &&
      composite.state.nationalSettlementAbandonmentSpiralIndex === settlementAbandonmentSpiral.nationalIndex,
    `abandonment spiral ${composite.state.nationalSettlementAbandonmentSpiralIndex}`,
  );

  const postCollapseRecoveryImpossibility = op10mA11ComputeSettlementPostCollapseRecoveryImpossibility({
    terminalStateLockIn: composite.state.terminalStateLockIn,
    fiscalPanicContagion: composite.state.fiscalPanicContagion,
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
  });
  push(
    out,
    'a11_170',
    composite.state.postCollapseRecoveryImpossibility.length === 8 &&
      composite.state.nationalPostCollapseRecoveryImpossibilityIndex === postCollapseRecoveryImpossibility.nationalIndex,
    `recovery impossibility ${composite.state.nationalPostCollapseRecoveryImpossibilityIndex}`,
  );

  push(
    out,
    'a11_171',
    composite.state.governanceVacuumEscalation.every((g) => g.narrative.includes('governance vacuum escalation')),
    composite.state.governanceVacuumEscalation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_172',
    composite.derived.some((d) => d.kind === 'governance_vacuum_escalation') ||
      composite.state.governanceVacuumEscalation.some((g) => g.band === 'hollow' || g.band === 'vacuum'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_173',
    composite.derived.some((d) => d.kind === 'settlement_abandonment_spiral') ||
      composite.state.settlementAbandonmentSpiral.some((s) => s.band === 'exodus' || s.band === 'abandoned'),
    composite.state.settlementAbandonmentSpiral[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_174',
    composite.persisted.lastSettlementAbandonmentSpiralIndex === composite.state.nationalSettlementAbandonmentSpiralIndex,
    `persisted abandonment ${composite.persisted.lastSettlementAbandonmentSpiralIndex}`,
  );

  push(
    out,
    'a11_175',
    composite.derived.some((d) => d.kind === 'post_collapse_recovery_impossibility') ||
      composite.state.postCollapseRecoveryImpossibility.some((p) => p.band === 'blocked' || p.band === 'impossible'),
    composite.state.postCollapseRecoveryImpossibility[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_176',
    composite.state.postCollapseRecoveryImpossibility.every((p) => p.narrative.includes('post-collapse recovery impossibility')),
    composite.state.postCollapseRecoveryImpossibility[0]?.band ?? 'none',
  );

  const stateCollapseCascadeAmplification = op10mA11ComputeRegionalStateCollapseCascadeAmplification({
    governanceVacuumEscalation: composite.state.governanceVacuumEscalation,
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    postCollapseRecoveryImpossibility: composite.state.postCollapseRecoveryImpossibility,
  });
  push(
    out,
    'a11_177',
    composite.state.stateCollapseCascadeAmplification.length === 8 &&
      composite.state.nationalStateCollapseCascadeAmplificationIndex === stateCollapseCascadeAmplification.nationalIndex,
    `cascade amplification ${composite.state.nationalStateCollapseCascadeAmplificationIndex}`,
  );

  const hollowRegionContagion = op10mA11ComputeInterregionalHollowRegionContagion({
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    fiscalPanicContagion: composite.state.fiscalPanicContagion,
    governanceVacuumEscalation: composite.state.governanceVacuumEscalation,
  });
  push(
    out,
    'a11_178',
    composite.state.hollowRegionContagion.length === 8 &&
      composite.state.nationalHollowRegionContagionIndex === hollowRegionContagion.nationalIndex,
    `hollow contagion ${composite.state.nationalHollowRegionContagionIndex}`,
  );

  const permanentDepopulationLock = op10mA11ComputeSettlementPermanentDepopulationLock({
    postCollapseRecoveryImpossibility: composite.state.postCollapseRecoveryImpossibility,
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    terminalStateLockIn: composite.state.terminalStateLockIn,
  });
  push(
    out,
    'a11_179',
    composite.state.permanentDepopulationLock.length === 8 &&
      composite.state.nationalPermanentDepopulationLockIndex === permanentDepopulationLock.nationalIndex,
    `depopulation lock ${composite.state.nationalPermanentDepopulationLockIndex}`,
  );

  push(
    out,
    'a11_180',
    composite.state.stateCollapseCascadeAmplification.every((s) => s.narrative.includes('state collapse cascade amplification')),
    composite.state.stateCollapseCascadeAmplification[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_181',
    composite.derived.some((d) => d.kind === 'state_collapse_cascade_amplification') ||
      composite.state.stateCollapseCascadeAmplification.some((s) => s.band === 'runaway' || s.band === 'total'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_182',
    composite.derived.some((d) => d.kind === 'hollow_region_contagion') ||
      composite.state.hollowRegionContagion.some((h) => h.band === 'contagion' || h.band === 'voided'),
    composite.state.hollowRegionContagion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_183',
    composite.persisted.lastHollowRegionContagionIndex === composite.state.nationalHollowRegionContagionIndex,
    `persisted hollow ${composite.persisted.lastHollowRegionContagionIndex}`,
  );

  push(
    out,
    'a11_184',
    composite.derived.some((d) => d.kind === 'permanent_depopulation_lock') ||
      composite.state.permanentDepopulationLock.some((p) => p.band === 'locked' || p.band === 'permanent'),
    composite.state.permanentDepopulationLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_185',
    composite.state.permanentDepopulationLock.every((p) => p.narrative.includes('permanent depopulation lock')),
    composite.state.permanentDepopulationLock[0]?.band ?? 'none',
  );

  const totalCollapseSingularity = op10mA11ComputeRegionalTotalCollapseSingularityPressure({
    stateCollapseCascadeAmplification: composite.state.stateCollapseCascadeAmplification,
    hollowRegionContagion: composite.state.hollowRegionContagion,
    permanentDepopulationLock: composite.state.permanentDepopulationLock,
  });
  push(
    out,
    'a11_186',
    composite.state.totalCollapseSingularity.length === 8 &&
      composite.state.nationalTotalCollapseSingularityIndex === totalCollapseSingularity.nationalIndex,
    `collapse singularity ${composite.state.nationalTotalCollapseSingularityIndex}`,
  );

  const voidExpansionVelocity = op10mA11ComputeInterregionalVoidExpansionVelocity({
    hollowRegionContagion: composite.state.hollowRegionContagion,
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    stateCollapseCascadeAmplification: composite.state.stateCollapseCascadeAmplification,
  });
  push(
    out,
    'a11_187',
    composite.state.voidExpansionVelocity.length === 8 &&
      composite.state.nationalVoidExpansionVelocityIndex === voidExpansionVelocity.nationalIndex,
    `void expansion ${composite.state.nationalVoidExpansionVelocityIndex}`,
  );

  const existentialContinuityFracture = op10mA11ComputeSettlementExistentialContinuityFracture({
    permanentDepopulationLock: composite.state.permanentDepopulationLock,
    postCollapseRecoveryImpossibility: composite.state.postCollapseRecoveryImpossibility,
    settlementLegitimacyCollapse: composite.state.settlementLegitimacyCollapse,
  });
  push(
    out,
    'a11_188',
    composite.state.existentialContinuityFracture.length === 8 &&
      composite.state.nationalExistentialContinuityFractureIndex === existentialContinuityFracture.nationalIndex,
    `continuity fracture ${composite.state.nationalExistentialContinuityFractureIndex}`,
  );

  push(
    out,
    'a11_189',
    composite.state.totalCollapseSingularity.every((s) => s.narrative.includes('total collapse singularity pressure')),
    composite.state.totalCollapseSingularity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_190',
    composite.derived.some((d) => d.kind === 'total_collapse_singularity_pressure') ||
      composite.state.totalCollapseSingularity.some((s) => s.band === 'singular' || s.band === 'total'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_191',
    composite.derived.some((d) => d.kind === 'void_expansion_velocity') ||
      composite.state.voidExpansionVelocity.some((v) => v.band === 'surging' || v.band === 'unbounded'),
    composite.state.voidExpansionVelocity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_192',
    composite.persisted.lastVoidExpansionVelocityIndex === composite.state.nationalVoidExpansionVelocityIndex,
    `persisted void ${composite.persisted.lastVoidExpansionVelocityIndex}`,
  );

  push(
    out,
    'a11_193',
    composite.derived.some((d) => d.kind === 'existential_continuity_fracture') ||
      composite.state.existentialContinuityFracture.some((e) => e.band === 'shattered' || e.band === 'extinguished'),
    composite.state.existentialContinuityFracture[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_194',
    composite.state.existentialContinuityFracture.every((e) => e.narrative.includes('existential continuity fracture')),
    composite.state.existentialContinuityFracture[0]?.band ?? 'none',
  );

  const collapseHorizonConvergence = op10mA11ComputeRegionalCollapseHorizonConvergence({
    totalCollapseSingularity: composite.state.totalCollapseSingularity,
    voidExpansionVelocity: composite.state.voidExpansionVelocity,
    existentialContinuityFracture: composite.state.existentialContinuityFracture,
  });
  push(
    out,
    'a11_195',
    composite.state.collapseHorizonConvergence.length === 8 &&
      composite.state.nationalCollapseHorizonConvergenceIndex === collapseHorizonConvergence.nationalIndex,
    `horizon convergence ${composite.state.nationalCollapseHorizonConvergenceIndex}`,
  );

  const voidTotalizationSurge = op10mA11ComputeInterregionalVoidTotalizationSurge({
    voidExpansionVelocity: composite.state.voidExpansionVelocity,
    totalCollapseSingularity: composite.state.totalCollapseSingularity,
    hollowRegionContagion: composite.state.hollowRegionContagion,
  });
  push(
    out,
    'a11_196',
    composite.state.voidTotalizationSurge.length === 8 &&
      composite.state.nationalVoidTotalizationSurgeIndex === voidTotalizationSurge.nationalIndex,
    `void totalization ${composite.state.nationalVoidTotalizationSurgeIndex}`,
  );

  const existentialTerminusLock = op10mA11ComputeSettlementExistentialTerminusLock({
    existentialContinuityFracture: composite.state.existentialContinuityFracture,
    totalCollapseSingularity: composite.state.totalCollapseSingularity,
    permanentDepopulationLock: composite.state.permanentDepopulationLock,
  });
  push(
    out,
    'a11_197',
    composite.state.existentialTerminusLock.length === 8 &&
      composite.state.nationalExistentialTerminusLockIndex === existentialTerminusLock.nationalIndex,
    `terminus lock ${composite.state.nationalExistentialTerminusLockIndex}`,
  );

  push(
    out,
    'a11_198',
    composite.state.collapseHorizonConvergence.every((c) => c.narrative.includes('collapse horizon convergence')),
    composite.state.collapseHorizonConvergence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_199',
    composite.derived.some((d) => d.kind === 'collapse_horizon_convergence') ||
      composite.state.collapseHorizonConvergence.some((c) => c.band === 'imminent' || c.band === 'locked'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_200',
    composite.derived.some((d) => d.kind === 'void_totalization_surge') ||
      composite.state.voidTotalizationSurge.some((v) => v.band === 'totalizing' || v.band === 'absolute'),
    composite.state.voidTotalizationSurge[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_201',
    composite.persisted.lastVoidTotalizationSurgeIndex === composite.state.nationalVoidTotalizationSurgeIndex,
    `persisted totalization ${composite.persisted.lastVoidTotalizationSurgeIndex}`,
  );

  push(
    out,
    'a11_202',
    composite.derived.some((d) => d.kind === 'existential_terminus_lock') ||
      composite.state.existentialTerminusLock.some((t) => t.band === 'sealed' || t.band === 'terminal'),
    composite.state.existentialTerminusLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_203',
    composite.state.existentialTerminusLock.every((t) => t.narrative.includes('existential terminus lock')),
    composite.state.existentialTerminusLock[0]?.band ?? 'none',
  );

  const absoluteCollapseHorizonLock = op10mA11ComputeRegionalAbsoluteCollapseHorizonLock({
    collapseHorizonConvergence: composite.state.collapseHorizonConvergence,
    voidTotalizationSurge: composite.state.voidTotalizationSurge,
    existentialTerminusLock: composite.state.existentialTerminusLock,
  });
  push(
    out,
    'a11_204',
    composite.state.absoluteCollapseHorizonLock.length === 8 &&
      composite.state.nationalAbsoluteCollapseHorizonLockIndex === absoluteCollapseHorizonLock.nationalIndex,
    `absolute horizon lock ${composite.state.nationalAbsoluteCollapseHorizonLockIndex}`,
  );

  const voidFinalizationCascade = op10mA11ComputeInterregionalVoidFinalizationCascade({
    voidTotalizationSurge: composite.state.voidTotalizationSurge,
    collapseHorizonConvergence: composite.state.collapseHorizonConvergence,
    voidExpansionVelocity: composite.state.voidExpansionVelocity,
  });
  push(
    out,
    'a11_205',
    composite.state.voidFinalizationCascade.length === 8 &&
      composite.state.nationalVoidFinalizationCascadeIndex === voidFinalizationCascade.nationalIndex,
    `void finalization ${composite.state.nationalVoidFinalizationCascadeIndex}`,
  );

  const existentialObliterationThreshold = op10mA11ComputeSettlementExistentialObliterationThreshold({
    existentialTerminusLock: composite.state.existentialTerminusLock,
    collapseHorizonConvergence: composite.state.collapseHorizonConvergence,
    existentialContinuityFracture: composite.state.existentialContinuityFracture,
  });
  push(
    out,
    'a11_206',
    composite.state.existentialObliterationThreshold.length === 8 &&
      composite.state.nationalExistentialObliterationThresholdIndex === existentialObliterationThreshold.nationalIndex,
    `obliteration threshold ${composite.state.nationalExistentialObliterationThresholdIndex}`,
  );

  push(
    out,
    'a11_207',
    composite.state.absoluteCollapseHorizonLock.every((a) => a.narrative.includes('absolute collapse horizon lock')),
    composite.state.absoluteCollapseHorizonLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_208',
    composite.derived.some((d) => d.kind === 'absolute_collapse_horizon_lock') ||
      composite.state.absoluteCollapseHorizonLock.some((a) => a.band === 'sealed' || a.band === 'absolute'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_209',
    composite.derived.some((d) => d.kind === 'void_finalization_cascade') ||
      composite.state.voidFinalizationCascade.some((v) => v.band === 'finalizing' || v.band === 'complete'),
    composite.state.voidFinalizationCascade[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_210',
    composite.persisted.lastVoidFinalizationCascadeIndex === composite.state.nationalVoidFinalizationCascadeIndex,
    `persisted finalization ${composite.persisted.lastVoidFinalizationCascadeIndex}`,
  );

  push(
    out,
    'a11_211',
    composite.derived.some((d) => d.kind === 'existential_obliteration_threshold') ||
      composite.state.existentialObliterationThreshold.some((o) => o.band === 'breached' || o.band === 'obliterated'),
    composite.state.existentialObliterationThreshold[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_212',
    composite.state.existentialObliterationThreshold.every((o) => o.narrative.includes('existential obliteration threshold')),
    composite.state.existentialObliterationThreshold[0]?.band ?? 'none',
  );

  const ultimateCollapseSingularitySeal = op10mA11ComputeRegionalUltimateCollapseSingularitySeal({
    absoluteCollapseHorizonLock: composite.state.absoluteCollapseHorizonLock,
    voidFinalizationCascade: composite.state.voidFinalizationCascade,
    existentialObliterationThreshold: composite.state.existentialObliterationThreshold,
  });
  push(
    out,
    'a11_213',
    composite.state.ultimateCollapseSingularitySeal.length === 8 &&
      composite.state.nationalUltimateCollapseSingularitySealIndex === ultimateCollapseSingularitySeal.nationalIndex,
    `singularity seal ${composite.state.nationalUltimateCollapseSingularitySealIndex}`,
  );

  const voidAnnihilationConvergence = op10mA11ComputeInterregionalVoidAnnihilationConvergence({
    voidFinalizationCascade: composite.state.voidFinalizationCascade,
    absoluteCollapseHorizonLock: composite.state.absoluteCollapseHorizonLock,
    voidTotalizationSurge: composite.state.voidTotalizationSurge,
  });
  push(
    out,
    'a11_214',
    composite.state.voidAnnihilationConvergence.length === 8 &&
      composite.state.nationalVoidAnnihilationConvergenceIndex === voidAnnihilationConvergence.nationalIndex,
    `void annihilation ${composite.state.nationalVoidAnnihilationConvergenceIndex}`,
  );

  const existentialNullStateLock = op10mA11ComputeSettlementExistentialNullStateLock({
    existentialObliterationThreshold: composite.state.existentialObliterationThreshold,
    absoluteCollapseHorizonLock: composite.state.absoluteCollapseHorizonLock,
    existentialTerminusLock: composite.state.existentialTerminusLock,
  });
  push(
    out,
    'a11_215',
    composite.state.existentialNullStateLock.length === 8 &&
      composite.state.nationalExistentialNullStateLockIndex === existentialNullStateLock.nationalIndex,
    `null-state lock ${composite.state.nationalExistentialNullStateLockIndex}`,
  );

  push(
    out,
    'a11_216',
    composite.state.ultimateCollapseSingularitySeal.every((s) => s.narrative.includes('ultimate collapse singularity seal')),
    composite.state.ultimateCollapseSingularitySeal[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_217',
    composite.derived.some((d) => d.kind === 'ultimate_collapse_singularity_seal') ||
      composite.state.ultimateCollapseSingularitySeal.some((s) => s.band === 'sealed' || s.band === 'ultimate'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_218',
    composite.derived.some((d) => d.kind === 'void_annihilation_convergence') ||
      composite.state.voidAnnihilationConvergence.some((v) => v.band === 'annihilating' || v.band === 'total'),
    composite.state.voidAnnihilationConvergence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_219',
    composite.persisted.lastVoidAnnihilationConvergenceIndex === composite.state.nationalVoidAnnihilationConvergenceIndex,
    `persisted annihilation ${composite.persisted.lastVoidAnnihilationConvergenceIndex}`,
  );

  push(
    out,
    'a11_220',
    composite.derived.some((d) => d.kind === 'existential_null_state_lock') ||
      composite.state.existentialNullStateLock.some((n) => n.band === 'null' || n.band === 'absolute_null'),
    composite.state.existentialNullStateLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_221',
    composite.state.existentialNullStateLock.every((n) => n.narrative.includes('existential null-state lock')),
    composite.state.existentialNullStateLock[0]?.band ?? 'none',
  );

  const collapseExistenceSingularityPoint = op10mA11ComputeRegionalCollapseExistenceSingularityPoint({
    ultimateCollapseSingularitySeal: composite.state.ultimateCollapseSingularitySeal,
    voidAnnihilationConvergence: composite.state.voidAnnihilationConvergence,
    existentialNullStateLock: composite.state.existentialNullStateLock,
  });
  push(
    out,
    'a11_222',
    composite.state.collapseExistenceSingularityPoint.length === 8 &&
      composite.state.nationalCollapseExistenceSingularityPointIndex === collapseExistenceSingularityPoint.nationalIndex,
    `existence point ${composite.state.nationalCollapseExistenceSingularityPointIndex}`,
  );

  const voidExistenceAnnihilationFront = op10mA11ComputeInterregionalVoidExistenceAnnihilationFront({
    voidAnnihilationConvergence: composite.state.voidAnnihilationConvergence,
    ultimateCollapseSingularitySeal: composite.state.ultimateCollapseSingularitySeal,
    voidFinalizationCascade: composite.state.voidFinalizationCascade,
  });
  push(
    out,
    'a11_223',
    composite.state.voidExistenceAnnihilationFront.length === 8 &&
      composite.state.nationalVoidExistenceAnnihilationFrontIndex === voidExistenceAnnihilationFront.nationalIndex,
    `void front ${composite.state.nationalVoidExistenceAnnihilationFrontIndex}`,
  );

  const existentialAbsoluteZeroLock = op10mA11ComputeSettlementExistentialAbsoluteZeroLock({
    existentialNullStateLock: composite.state.existentialNullStateLock,
    ultimateCollapseSingularitySeal: composite.state.ultimateCollapseSingularitySeal,
    existentialObliterationThreshold: composite.state.existentialObliterationThreshold,
  });
  push(
    out,
    'a11_224',
    composite.state.existentialAbsoluteZeroLock.length === 8 &&
      composite.state.nationalExistentialAbsoluteZeroLockIndex === existentialAbsoluteZeroLock.nationalIndex,
    `absolute zero ${composite.state.nationalExistentialAbsoluteZeroLockIndex}`,
  );

  push(
    out,
    'a11_225',
    composite.state.collapseExistenceSingularityPoint.every((p) => p.narrative.includes('collapse existence singularity point')),
    composite.state.collapseExistenceSingularityPoint[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_226',
    composite.derived.some((d) => d.kind === 'collapse_existence_singularity_point') ||
      composite.state.collapseExistenceSingularityPoint.some((p) => p.band === 'singular' || p.band === 'existential'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_227',
    composite.derived.some((d) => d.kind === 'void_existence_annihilation_front') ||
      composite.state.voidExistenceAnnihilationFront.some((f) => f.band === 'consuming' || f.band === 'total_void'),
    composite.state.voidExistenceAnnihilationFront[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_228',
    composite.persisted.lastVoidExistenceAnnihilationFrontIndex === composite.state.nationalVoidExistenceAnnihilationFrontIndex,
    `persisted void front ${composite.persisted.lastVoidExistenceAnnihilationFrontIndex}`,
  );

  push(
    out,
    'a11_229',
    composite.derived.some((d) => d.kind === 'existential_absolute_zero_lock') ||
      composite.state.existentialAbsoluteZeroLock.some((z) => z.band === 'zero' || z.band === 'absolute_zero'),
    composite.state.existentialAbsoluteZeroLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_230',
    composite.state.existentialAbsoluteZeroLock.every((z) => z.narrative.includes('existential absolute zero lock')),
    composite.state.existentialAbsoluteZeroLock[0]?.band ?? 'none',
  );

  const collapseOmniSingularityNode = op10mA11ComputeRegionalCollapseOmniSingularityNode({
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
    existentialAbsoluteZeroLock: composite.state.existentialAbsoluteZeroLock,
  });
  push(
    out,
    'a11_231',
    composite.state.collapseOmniSingularityNode.length === 8 &&
      composite.state.nationalCollapseOmniSingularityNodeIndex === collapseOmniSingularityNode.nationalIndex,
    `omni node ${composite.state.nationalCollapseOmniSingularityNodeIndex}`,
  );

  const voidAbsoluteErosionSurge = op10mA11ComputeInterregionalVoidAbsoluteErosionSurge({
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
    voidAnnihilationConvergence: composite.state.voidAnnihilationConvergence,
  });
  push(
    out,
    'a11_232',
    composite.state.voidAbsoluteErosionSurge.length === 8 &&
      composite.state.nationalVoidAbsoluteErosionSurgeIndex === voidAbsoluteErosionSurge.nationalIndex,
    `erosion surge ${composite.state.nationalVoidAbsoluteErosionSurgeIndex}`,
  );

  const existentialFinalNullityLock = op10mA11ComputeSettlementExistentialFinalNullityLock({
    existentialAbsoluteZeroLock: composite.state.existentialAbsoluteZeroLock,
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
    existentialNullStateLock: composite.state.existentialNullStateLock,
  });
  push(
    out,
    'a11_233',
    composite.state.existentialFinalNullityLock.length === 8 &&
      composite.state.nationalExistentialFinalNullityLockIndex === existentialFinalNullityLock.nationalIndex,
    `final nullity ${composite.state.nationalExistentialFinalNullityLockIndex}`,
  );

  push(
    out,
    'a11_234',
    composite.state.collapseOmniSingularityNode.every((n) => n.narrative.includes('collapse omni singularity node')),
    composite.state.collapseOmniSingularityNode[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_235',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_node') ||
      composite.state.collapseOmniSingularityNode.some((n) => n.band === 'omni' || n.band === 'total_node'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_236',
    composite.derived.some((d) => d.kind === 'void_absolute_erosion_surge') ||
      composite.state.voidAbsoluteErosionSurge.some((e) => e.band === 'absolute' || e.band === 'omni_erosion'),
    composite.state.voidAbsoluteErosionSurge[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_237',
    composite.persisted.lastVoidAbsoluteErosionSurgeIndex === composite.state.nationalVoidAbsoluteErosionSurgeIndex,
    `persisted erosion ${composite.persisted.lastVoidAbsoluteErosionSurgeIndex}`,
  );

  push(
    out,
    'a11_238',
    composite.derived.some((d) => d.kind === 'existential_final_nullity_lock') ||
      composite.state.existentialFinalNullityLock.some((f) => f.band === 'nullity' || f.band === 'final_nullity'),
    composite.state.existentialFinalNullityLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_239',
    composite.state.existentialFinalNullityLock.every((f) => f.narrative.includes('existential final nullity lock')),
    composite.state.existentialFinalNullityLock[0]?.band ?? 'none',
  );

  const collapseTotalSingularityVertex = op10mA11ComputeRegionalCollapseTotalSingularityVertex({
    collapseOmniSingularityNode: composite.state.collapseOmniSingularityNode,
    voidAbsoluteErosionSurge: composite.state.voidAbsoluteErosionSurge,
    existentialFinalNullityLock: composite.state.existentialFinalNullityLock,
  });
  push(
    out,
    'a11_240',
    composite.state.collapseTotalSingularityVertex.length === 8 &&
      composite.state.nationalCollapseTotalSingularityVertexIndex === collapseTotalSingularityVertex.nationalIndex,
    `total vertex ${composite.state.nationalCollapseTotalSingularityVertexIndex}`,
  );

  const voidTerminalErosionCascade = op10mA11ComputeInterregionalVoidTerminalErosionCascade({
    voidAbsoluteErosionSurge: composite.state.voidAbsoluteErosionSurge,
    collapseOmniSingularityNode: composite.state.collapseOmniSingularityNode,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_241',
    composite.state.voidTerminalErosionCascade.length === 8 &&
      composite.state.nationalVoidTerminalErosionCascadeIndex === voidTerminalErosionCascade.nationalIndex,
    `terminal erosion ${composite.state.nationalVoidTerminalErosionCascadeIndex}`,
  );

  const existentialUltimateNullitySeal = op10mA11ComputeSettlementExistentialUltimateNullitySeal({
    existentialFinalNullityLock: composite.state.existentialFinalNullityLock,
    collapseOmniSingularityNode: composite.state.collapseOmniSingularityNode,
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
  });
  push(
    out,
    'a11_242',
    composite.state.existentialUltimateNullitySeal.length === 8 &&
      composite.state.nationalExistentialUltimateNullitySealIndex === existentialUltimateNullitySeal.nationalIndex,
    `ultimate seal ${composite.state.nationalExistentialUltimateNullitySealIndex}`,
  );

  push(
    out,
    'a11_243',
    composite.state.collapseTotalSingularityVertex.every((v) => v.narrative.includes('collapse total singularity vertex')),
    composite.state.collapseTotalSingularityVertex[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_244',
    composite.derived.some((d) => d.kind === 'collapse_total_singularity_vertex') ||
      composite.state.collapseTotalSingularityVertex.some((v) => v.band === 'total' || v.band === 'vertex'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_245',
    composite.derived.some((d) => d.kind === 'void_terminal_erosion_cascade') ||
      composite.state.voidTerminalErosionCascade.some((c) => c.band === 'cascade' || c.band === 'total_erosion'),
    composite.state.voidTerminalErosionCascade[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_246',
    composite.persisted.lastVoidTerminalErosionCascadeIndex === composite.state.nationalVoidTerminalErosionCascadeIndex,
    `persisted terminal ${composite.persisted.lastVoidTerminalErosionCascadeIndex}`,
  );

  push(
    out,
    'a11_247',
    composite.derived.some((d) => d.kind === 'existential_ultimate_nullity_seal') ||
      composite.state.existentialUltimateNullitySeal.some((s) => s.band === 'ultimate' || s.band === 'total_seal'),
    composite.state.existentialUltimateNullitySeal[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_248',
    composite.state.existentialUltimateNullitySeal.every((s) => s.narrative.includes('existential ultimate nullity seal')),
    composite.state.existentialUltimateNullitySeal[0]?.band ?? 'none',
  );

  const collapseAbsoluteSingularityApex = op10mA11ComputeRegionalCollapseAbsoluteSingularityApex({
    collapseTotalSingularityVertex: composite.state.collapseTotalSingularityVertex,
    voidTerminalErosionCascade: composite.state.voidTerminalErosionCascade,
    existentialUltimateNullitySeal: composite.state.existentialUltimateNullitySeal,
  });
  push(
    out,
    'a11_249',
    composite.state.collapseAbsoluteSingularityApex.length === 8 &&
      composite.state.nationalCollapseAbsoluteSingularityApexIndex === collapseAbsoluteSingularityApex.nationalIndex,
    `singularity apex ${composite.state.nationalCollapseAbsoluteSingularityApexIndex}`,
  );

  const voidCompleteErosionTerminality = op10mA11ComputeInterregionalVoidCompleteErosionTerminality({
    voidTerminalErosionCascade: composite.state.voidTerminalErosionCascade,
    collapseTotalSingularityVertex: composite.state.collapseTotalSingularityVertex,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_250',
    composite.state.voidCompleteErosionTerminality.length === 8 &&
      composite.state.nationalVoidCompleteErosionTerminalityIndex === voidCompleteErosionTerminality.nationalIndex,
    `complete terminality ${composite.state.nationalVoidCompleteErosionTerminalityIndex}`,
  );

  const existentialFinalNullityClosure = op10mA11ComputeSettlementExistentialFinalNullityClosure({
    existentialUltimateNullitySeal: composite.state.existentialUltimateNullitySeal,
    collapseTotalSingularityVertex: composite.state.collapseTotalSingularityVertex,
    existentialFinalNullityLock: composite.state.existentialFinalNullityLock,
  });
  push(
    out,
    'a11_251',
    composite.state.existentialFinalNullityClosure.length === 8 &&
      composite.state.nationalExistentialFinalNullityClosureIndex === existentialFinalNullityClosure.nationalIndex,
    `nullity closure ${composite.state.nationalExistentialFinalNullityClosureIndex}`,
  );

  push(
    out,
    'a11_252',
    composite.state.collapseAbsoluteSingularityApex.every((a) => a.narrative.includes('collapse absolute singularity apex')),
    composite.state.collapseAbsoluteSingularityApex[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_253',
    composite.derived.some((d) => d.kind === 'collapse_absolute_singularity_apex') ||
      composite.state.collapseAbsoluteSingularityApex.some((a) => a.band === 'total' || a.band === 'apex'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_254',
    composite.derived.some((d) => d.kind === 'void_complete_erosion_terminality') ||
      composite.state.voidCompleteErosionTerminality.some((t) => t.band === 'terminal' || t.band === 'total_terminality'),
    composite.state.voidCompleteErosionTerminality[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_255',
    composite.persisted.lastVoidCompleteErosionTerminalityIndex === composite.state.nationalVoidCompleteErosionTerminalityIndex,
    `persisted complete ${composite.persisted.lastVoidCompleteErosionTerminalityIndex}`,
  );

  push(
    out,
    'a11_256',
    composite.derived.some((d) => d.kind === 'existential_final_nullity_closure') ||
      composite.state.existentialFinalNullityClosure.some((c) => c.band === 'final' || c.band === 'total_closure'),
    composite.state.existentialFinalNullityClosure[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_257',
    composite.state.existentialFinalNullityClosure.every((c) => c.narrative.includes('existential final nullity closure')),
    composite.state.existentialFinalNullityClosure[0]?.band ?? 'none',
  );

  const collapseUltimateSingularityZenith = op10mA11ComputeRegionalCollapseUltimateSingularityZenith({
    collapseAbsoluteSingularityApex: composite.state.collapseAbsoluteSingularityApex,
    voidCompleteErosionTerminality: composite.state.voidCompleteErosionTerminality,
    existentialFinalNullityClosure: composite.state.existentialFinalNullityClosure,
  });
  push(
    out,
    'a11_258',
    composite.state.collapseUltimateSingularityZenith.length === 8 &&
      composite.state.nationalCollapseUltimateSingularityZenithIndex === collapseUltimateSingularityZenith.nationalIndex,
    `singularity zenith ${composite.state.nationalCollapseUltimateSingularityZenithIndex}`,
  );

  const voidTotalErosionFinality = op10mA11ComputeInterregionalVoidTotalErosionFinality({
    voidCompleteErosionTerminality: composite.state.voidCompleteErosionTerminality,
    collapseAbsoluteSingularityApex: composite.state.collapseAbsoluteSingularityApex,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_259',
    composite.state.voidTotalErosionFinality.length === 8 &&
      composite.state.nationalVoidTotalErosionFinalityIndex === voidTotalErosionFinality.nationalIndex,
    `total finality ${composite.state.nationalVoidTotalErosionFinalityIndex}`,
  );

  const existentialAbsoluteNullityVerdict = op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict({
    existentialFinalNullityClosure: composite.state.existentialFinalNullityClosure,
    collapseAbsoluteSingularityApex: composite.state.collapseAbsoluteSingularityApex,
    existentialUltimateNullitySeal: composite.state.existentialUltimateNullitySeal,
  });
  push(
    out,
    'a11_260',
    composite.state.existentialAbsoluteNullityVerdict.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityVerdictIndex === existentialAbsoluteNullityVerdict.nationalIndex,
    `nullity verdict ${composite.state.nationalExistentialAbsoluteNullityVerdictIndex}`,
  );

  push(
    out,
    'a11_261',
    composite.state.collapseUltimateSingularityZenith.every((z) => z.narrative.includes('collapse ultimate singularity zenith')),
    composite.state.collapseUltimateSingularityZenith[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_262',
    composite.derived.some((d) => d.kind === 'collapse_ultimate_singularity_zenith') ||
      composite.state.collapseUltimateSingularityZenith.some((z) => z.band === 'total' || z.band === 'zenith'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_263',
    composite.derived.some((d) => d.kind === 'void_total_erosion_finality') ||
      composite.state.voidTotalErosionFinality.some((f) => f.band === 'final' || f.band === 'total_finality'),
    composite.state.voidTotalErosionFinality[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_264',
    composite.persisted.lastVoidTotalErosionFinalityIndex === composite.state.nationalVoidTotalErosionFinalityIndex,
    `persisted finality ${composite.persisted.lastVoidTotalErosionFinalityIndex}`,
  );

  push(
    out,
    'a11_265',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_verdict') ||
      composite.state.existentialAbsoluteNullityVerdict.some((v) => v.band === 'absolute' || v.band === 'total_verdict'),
    composite.state.existentialAbsoluteNullityVerdict[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_266',
    composite.state.existentialAbsoluteNullityVerdict.every((v) => v.narrative.includes('existential absolute nullity verdict')),
    composite.state.existentialAbsoluteNullityVerdict[0]?.band ?? 'none',
  );

  const collapseTotalSingularityNexus = op10mA11ComputeRegionalCollapseTotalSingularityNexus({
    collapseUltimateSingularityZenith: composite.state.collapseUltimateSingularityZenith,
    voidTotalErosionFinality: composite.state.voidTotalErosionFinality,
    existentialAbsoluteNullityVerdict: composite.state.existentialAbsoluteNullityVerdict,
  });
  push(
    out,
    'a11_267',
    composite.state.collapseTotalSingularityNexus.length === 8 &&
      composite.state.nationalCollapseTotalSingularityNexusIndex === collapseTotalSingularityNexus.nationalIndex,
    `singularity nexus ${composite.state.nationalCollapseTotalSingularityNexusIndex}`,
  );

  const voidAbsoluteErosionTermination = op10mA11ComputeInterregionalVoidAbsoluteErosionTermination({
    voidTotalErosionFinality: composite.state.voidTotalErosionFinality,
    collapseUltimateSingularityZenith: composite.state.collapseUltimateSingularityZenith,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_268',
    composite.state.voidAbsoluteErosionTermination.length === 8 &&
      composite.state.nationalVoidAbsoluteErosionTerminationIndex === voidAbsoluteErosionTermination.nationalIndex,
    `erosion termination ${composite.state.nationalVoidAbsoluteErosionTerminationIndex}`,
  );

  const existentialFinalNullitySentence = op10mA11ComputeSettlementExistentialFinalNullitySentence({
    existentialAbsoluteNullityVerdict: composite.state.existentialAbsoluteNullityVerdict,
    collapseUltimateSingularityZenith: composite.state.collapseUltimateSingularityZenith,
    existentialFinalNullityClosure: composite.state.existentialFinalNullityClosure,
  });
  push(
    out,
    'a11_269',
    composite.state.existentialFinalNullitySentence.length === 8 &&
      composite.state.nationalExistentialFinalNullitySentenceIndex === existentialFinalNullitySentence.nationalIndex,
    `nullity sentence ${composite.state.nationalExistentialFinalNullitySentenceIndex}`,
  );

  push(
    out,
    'a11_270',
    composite.state.collapseTotalSingularityNexus.every((n) => n.narrative.includes('collapse total singularity nexus')),
    composite.state.collapseTotalSingularityNexus[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_271',
    composite.derived.some((d) => d.kind === 'collapse_total_singularity_nexus') ||
      composite.state.collapseTotalSingularityNexus.some((n) => n.band === 'total' || n.band === 'nexus'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_272',
    composite.derived.some((d) => d.kind === 'void_absolute_erosion_termination') ||
      composite.state.voidAbsoluteErosionTermination.some((t) => t.band === 'absolute' || t.band === 'total_termination'),
    composite.state.voidAbsoluteErosionTermination[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_273',
    composite.persisted.lastVoidAbsoluteErosionTerminationIndex === composite.state.nationalVoidAbsoluteErosionTerminationIndex,
    `persisted termination ${composite.persisted.lastVoidAbsoluteErosionTerminationIndex}`,
  );

  push(
    out,
    'a11_274',
    composite.derived.some((d) => d.kind === 'existential_final_nullity_sentence') ||
      composite.state.existentialFinalNullitySentence.some((s) => s.band === 'final' || s.band === 'total_sentence'),
    composite.state.existentialFinalNullitySentence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_275',
    composite.state.existentialFinalNullitySentence.every((s) => s.narrative.includes('existential final nullity sentence')),
    composite.state.existentialFinalNullitySentence[0]?.band ?? 'none',
  );

  const collapseAbsoluteSingularityCulmination = op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination({
    collapseTotalSingularityNexus: composite.state.collapseTotalSingularityNexus,
    voidAbsoluteErosionTermination: composite.state.voidAbsoluteErosionTermination,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_276',
    composite.state.collapseAbsoluteSingularityCulmination.length === 8 &&
      composite.state.nationalCollapseAbsoluteSingularityCulminationIndex === collapseAbsoluteSingularityCulmination.nationalIndex,
    `singularity culmination ${composite.state.nationalCollapseAbsoluteSingularityCulminationIndex}`,
  );

  const voidCompleteErosionExtinction = op10mA11ComputeInterregionalVoidCompleteErosionExtinction({
    voidAbsoluteErosionTermination: composite.state.voidAbsoluteErosionTermination,
    collapseTotalSingularityNexus: composite.state.collapseTotalSingularityNexus,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_277',
    composite.state.voidCompleteErosionExtinction.length === 8 &&
      composite.state.nationalVoidCompleteErosionExtinctionIndex === voidCompleteErosionExtinction.nationalIndex,
    `erosion extinction ${composite.state.nationalVoidCompleteErosionExtinctionIndex}`,
  );

  const existentialTotalNullityDecree = op10mA11ComputeSettlementExistentialTotalNullityDecree({
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
    collapseTotalSingularityNexus: composite.state.collapseTotalSingularityNexus,
    existentialAbsoluteNullityVerdict: composite.state.existentialAbsoluteNullityVerdict,
  });
  push(
    out,
    'a11_278',
    composite.state.existentialTotalNullityDecree.length === 8 &&
      composite.state.nationalExistentialTotalNullityDecreeIndex === existentialTotalNullityDecree.nationalIndex,
    `nullity decree ${composite.state.nationalExistentialTotalNullityDecreeIndex}`,
  );

  push(
    out,
    'a11_279',
    composite.state.collapseAbsoluteSingularityCulmination.every((c) => c.narrative.includes('collapse absolute singularity culmination')),
    composite.state.collapseAbsoluteSingularityCulmination[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_280',
    composite.derived.some((d) => d.kind === 'collapse_absolute_singularity_culmination') ||
      composite.state.collapseAbsoluteSingularityCulmination.some((c) => c.band === 'total' || c.band === 'culmination'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_281',
    composite.derived.some((d) => d.kind === 'void_complete_erosion_extinction') ||
      composite.state.voidCompleteErosionExtinction.some((e) => e.band === 'complete' || e.band === 'total_extinction'),
    composite.state.voidCompleteErosionExtinction[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_282',
    composite.persisted.lastVoidCompleteErosionExtinctionIndex === composite.state.nationalVoidCompleteErosionExtinctionIndex,
    `persisted extinction ${composite.persisted.lastVoidCompleteErosionExtinctionIndex}`,
  );

  push(
    out,
    'a11_283',
    composite.derived.some((d) => d.kind === 'existential_total_nullity_decree') ||
      composite.state.existentialTotalNullityDecree.some((d) => d.band === 'total' || d.band === 'absolute_decree'),
    composite.state.existentialTotalNullityDecree[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_284',
    composite.state.existentialTotalNullityDecree.every((d) => d.narrative.includes('existential total nullity decree')),
    composite.state.existentialTotalNullityDecree[0]?.band ?? 'none',
  );

  const collapseOmniSingularitySynthesis = op10mA11ComputeRegionalCollapseOmniSingularitySynthesis({
    collapseAbsoluteSingularityCulmination: composite.state.collapseAbsoluteSingularityCulmination,
    voidCompleteErosionExtinction: composite.state.voidCompleteErosionExtinction,
    existentialTotalNullityDecree: composite.state.existentialTotalNullityDecree,
  });
  push(
    out,
    'a11_285',
    composite.state.collapseOmniSingularitySynthesis.length === 8 &&
      composite.state.nationalCollapseOmniSingularitySynthesisIndex === collapseOmniSingularitySynthesis.nationalIndex,
    `omni synthesis ${composite.state.nationalCollapseOmniSingularitySynthesisIndex}`,
  );

  const voidTotalErosionAnnihilation = op10mA11ComputeInterregionalVoidTotalErosionAnnihilation({
    voidCompleteErosionExtinction: composite.state.voidCompleteErosionExtinction,
    collapseAbsoluteSingularityCulmination: composite.state.collapseAbsoluteSingularityCulmination,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_286',
    composite.state.voidTotalErosionAnnihilation.length === 8 &&
      composite.state.nationalVoidTotalErosionAnnihilationIndex === voidTotalErosionAnnihilation.nationalIndex,
    `erosion annihilation ${composite.state.nationalVoidTotalErosionAnnihilationIndex}`,
  );

  const existentialAbsoluteNullityMandate = op10mA11ComputeSettlementExistentialAbsoluteNullityMandate({
    existentialTotalNullityDecree: composite.state.existentialTotalNullityDecree,
    collapseAbsoluteSingularityCulmination: composite.state.collapseAbsoluteSingularityCulmination,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_287',
    composite.state.existentialAbsoluteNullityMandate.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityMandateIndex === existentialAbsoluteNullityMandate.nationalIndex,
    `nullity mandate ${composite.state.nationalExistentialAbsoluteNullityMandateIndex}`,
  );

  push(
    out,
    'a11_288',
    composite.state.collapseOmniSingularitySynthesis.every((s) => s.narrative.includes('collapse omni singularity synthesis')),
    composite.state.collapseOmniSingularitySynthesis[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_289',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_synthesis') ||
      composite.state.collapseOmniSingularitySynthesis.some((s) => s.band === 'total' || s.band === 'synthesis'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_290',
    composite.derived.some((d) => d.kind === 'void_total_erosion_annihilation') ||
      composite.state.voidTotalErosionAnnihilation.some((a) => a.band === 'total' || a.band === 'complete_annihilation'),
    composite.state.voidTotalErosionAnnihilation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_291',
    composite.persisted.lastVoidTotalErosionAnnihilationIndex === composite.state.nationalVoidTotalErosionAnnihilationIndex,
    `persisted annihilation ${composite.persisted.lastVoidTotalErosionAnnihilationIndex}`,
  );

  push(
    out,
    'a11_292',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_mandate') ||
      composite.state.existentialAbsoluteNullityMandate.some((m) => m.band === 'absolute' || m.band === 'total_mandate'),
    composite.state.existentialAbsoluteNullityMandate[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_293',
    composite.state.existentialAbsoluteNullityMandate.every((m) => m.narrative.includes('existential absolute nullity mandate')),
    composite.state.existentialAbsoluteNullityMandate[0]?.band ?? 'none',
  );

  const collapseOmniSingularityConvergence = op10mA11ComputeRegionalCollapseOmniSingularityConvergence({
    collapseOmniSingularitySynthesis: composite.state.collapseOmniSingularitySynthesis,
    voidTotalErosionAnnihilation: composite.state.voidTotalErosionAnnihilation,
    existentialAbsoluteNullityMandate: composite.state.existentialAbsoluteNullityMandate,
  });
  push(
    out,
    'a11_294',
    composite.state.collapseOmniSingularityConvergence.length === 8 &&
      composite.state.nationalCollapseOmniSingularityConvergenceIndex === collapseOmniSingularityConvergence.nationalIndex,
    `omni convergence ${composite.state.nationalCollapseOmniSingularityConvergenceIndex}`,
  );

  const voidTotalErosionObliteration = op10mA11ComputeInterregionalVoidTotalErosionObliteration({
    voidTotalErosionAnnihilation: composite.state.voidTotalErosionAnnihilation,
    collapseOmniSingularitySynthesis: composite.state.collapseOmniSingularitySynthesis,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_295',
    composite.state.voidTotalErosionObliteration.length === 8 &&
      composite.state.nationalVoidTotalErosionObliterationIndex === voidTotalErosionObliteration.nationalIndex,
    `erosion obliteration ${composite.state.nationalVoidTotalErosionObliterationIndex}`,
  );

  const existentialAbsoluteNullityBinding = op10mA11ComputeSettlementExistentialAbsoluteNullityBinding({
    existentialAbsoluteNullityMandate: composite.state.existentialAbsoluteNullityMandate,
    collapseOmniSingularitySynthesis: composite.state.collapseOmniSingularitySynthesis,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_296',
    composite.state.existentialAbsoluteNullityBinding.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityBindingIndex === existentialAbsoluteNullityBinding.nationalIndex,
    `nullity binding ${composite.state.nationalExistentialAbsoluteNullityBindingIndex}`,
  );

  push(
    out,
    'a11_297',
    composite.state.collapseOmniSingularityConvergence.every((c) => c.narrative.includes('collapse omni singularity convergence')),
    composite.state.collapseOmniSingularityConvergence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_298',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_convergence') ||
      composite.state.collapseOmniSingularityConvergence.some((c) => c.band === 'total' || c.band === 'convergence'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_299',
    composite.derived.some((d) => d.kind === 'void_total_erosion_obliteration') ||
      composite.state.voidTotalErosionObliteration.some((o) => o.band === 'total' || o.band === 'complete_obliteration'),
    composite.state.voidTotalErosionObliteration[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_300',
    composite.persisted.lastVoidTotalErosionObliterationIndex === composite.state.nationalVoidTotalErosionObliterationIndex,
    `persisted obliteration ${composite.persisted.lastVoidTotalErosionObliterationIndex}`,
  );

  push(
    out,
    'a11_301',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_binding') ||
      composite.state.existentialAbsoluteNullityBinding.some((b) => b.band === 'absolute' || b.band === 'total_binding'),
    composite.state.existentialAbsoluteNullityBinding[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_302',
    composite.state.existentialAbsoluteNullityBinding.every((b) => b.narrative.includes('existential absolute nullity binding')),
    composite.state.existentialAbsoluteNullityBinding[0]?.band ?? 'none',
  );
  const collapseOmniSingularityIntegration = op10mA11ComputeRegionalCollapseOmniSingularityIntegration({
    collapseOmniSingularityConvergence: composite.state.collapseOmniSingularityConvergence,
    voidTotalErosionObliteration: composite.state.voidTotalErosionObliteration,
    existentialAbsoluteNullityBinding: composite.state.existentialAbsoluteNullityBinding,
  });
  push(
    out,
    'a11_303',
    composite.state.collapseOmniSingularityIntegration.length === 8 &&
      composite.state.nationalCollapseOmniSingularityIntegrationIndex === collapseOmniSingularityIntegration.nationalIndex,
    `omni integration ${composite.state.nationalCollapseOmniSingularityIntegrationIndex}`,
  );

  const voidTotalErosionEradication = op10mA11ComputeInterregionalVoidTotalErosionEradication({
    voidTotalErosionObliteration: composite.state.voidTotalErosionObliteration,
    collapseOmniSingularityConvergence: composite.state.collapseOmniSingularityConvergence,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_304',
    composite.state.voidTotalErosionEradication.length === 8 &&
      composite.state.nationalVoidTotalErosionEradicationIndex === voidTotalErosionEradication.nationalIndex,
    `erosion eradication ${composite.state.nationalVoidTotalErosionEradicationIndex}`,
  );

  const existentialAbsoluteNullityContinuity = op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity({
    existentialAbsoluteNullityBinding: composite.state.existentialAbsoluteNullityBinding,
    collapseOmniSingularityConvergence: composite.state.collapseOmniSingularityConvergence,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_305',
    composite.state.existentialAbsoluteNullityContinuity.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityContinuityIndex === existentialAbsoluteNullityContinuity.nationalIndex,
    `nullity continuity ${composite.state.nationalExistentialAbsoluteNullityContinuityIndex}`,
  );

  push(
    out,
    'a11_306',
    composite.state.collapseOmniSingularityIntegration.every((i) => i.narrative.includes('collapse omni singularity integration')),
    composite.state.collapseOmniSingularityIntegration[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_307',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_integration') ||
      composite.state.collapseOmniSingularityIntegration.some((i) => i.band === 'total' || i.band === 'integration'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_308',
    composite.derived.some((d) => d.kind === 'void_total_erosion_eradication') ||
      composite.state.voidTotalErosionEradication.some((e) => e.band === 'total' || e.band === 'complete_eradication'),
    composite.state.voidTotalErosionEradication[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_309',
    composite.persisted.lastVoidTotalErosionEradicationIndex === composite.state.nationalVoidTotalErosionEradicationIndex,
    `persisted eradication ${composite.persisted.lastVoidTotalErosionEradicationIndex}`,
  );

  push(
    out,
    'a11_310',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_continuity') ||
      composite.state.existentialAbsoluteNullityContinuity.some((b) => b.band === 'absolute' || b.band === 'total_continuity'),
    composite.state.existentialAbsoluteNullityContinuity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_311',
    composite.state.existentialAbsoluteNullityContinuity.every((b) => b.narrative.includes('existential absolute nullity continuity')),
    composite.state.existentialAbsoluteNullityContinuity[0]?.band ?? 'none',
  );
  const collapseOmniSingularityUnification = op10mA11ComputeRegionalCollapseOmniSingularityUnification({
    collapseOmniSingularityIntegration: composite.state.collapseOmniSingularityIntegration,
    voidTotalErosionEradication: composite.state.voidTotalErosionEradication,
    existentialAbsoluteNullityContinuity: composite.state.existentialAbsoluteNullityContinuity,
  });
  push(
    out,
    'a11_312',
    composite.state.collapseOmniSingularityUnification.length === 8 &&
      composite.state.nationalCollapseOmniSingularityUnificationIndex === collapseOmniSingularityUnification.nationalIndex,
    `omni unification ${composite.state.nationalCollapseOmniSingularityUnificationIndex}`,
  );

  const voidTotalErosionElimination = op10mA11ComputeInterregionalVoidTotalErosionElimination({
    voidTotalErosionEradication: composite.state.voidTotalErosionEradication,
    collapseOmniSingularityIntegration: composite.state.collapseOmniSingularityIntegration,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_313',
    composite.state.voidTotalErosionElimination.length === 8 &&
      composite.state.nationalVoidTotalErosionEliminationIndex === voidTotalErosionElimination.nationalIndex,
    `erosion elimination ${composite.state.nationalVoidTotalErosionEliminationIndex}`,
  );

  const existentialAbsoluteNullityPerpetuity = op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity({
    existentialAbsoluteNullityContinuity: composite.state.existentialAbsoluteNullityContinuity,
    collapseOmniSingularityIntegration: composite.state.collapseOmniSingularityIntegration,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_314',
    composite.state.existentialAbsoluteNullityPerpetuity.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityPerpetuityIndex === existentialAbsoluteNullityPerpetuity.nationalIndex,
    `nullity perpetuity ${composite.state.nationalExistentialAbsoluteNullityPerpetuityIndex}`,
  );

  push(
    out,
    'a11_315',
    composite.state.collapseOmniSingularityUnification.every((u) => u.narrative.includes('collapse omni singularity unification')),
    composite.state.collapseOmniSingularityUnification[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_316',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_unification') ||
      composite.state.collapseOmniSingularityUnification.some((u) => u.band === 'total' || u.band === 'unification'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_317',
    composite.derived.some((d) => d.kind === 'void_total_erosion_elimination') ||
      composite.state.voidTotalErosionElimination.some((e) => e.band === 'total' || e.band === 'complete_elimination'),
    composite.state.voidTotalErosionElimination[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_318',
    composite.persisted.lastVoidTotalErosionEliminationIndex === composite.state.nationalVoidTotalErosionEliminationIndex,
    `persisted elimination ${composite.persisted.lastVoidTotalErosionEliminationIndex}`,
  );

  push(
    out,
    'a11_319',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_perpetuity') ||
      composite.state.existentialAbsoluteNullityPerpetuity.some((p) => p.band === 'absolute' || p.band === 'total_perpetuity'),
    composite.state.existentialAbsoluteNullityPerpetuity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_320',
    composite.state.existentialAbsoluteNullityPerpetuity.every((p) => p.narrative.includes('existential absolute nullity perpetuity')),
    composite.state.existentialAbsoluteNullityPerpetuity[0]?.band ?? 'none',
  );

  const collapseOmniSingularityConsolidation = op10mA11ComputeRegionalCollapseOmniSingularityConsolidation({
    collapseOmniSingularityUnification: composite.state.collapseOmniSingularityUnification,
    voidTotalErosionElimination: composite.state.voidTotalErosionElimination,
    existentialAbsoluteNullityPerpetuity: composite.state.existentialAbsoluteNullityPerpetuity,
  });
  push(
    out,
    'a11_321',
    composite.state.collapseOmniSingularityConsolidation.length === 8 &&
      composite.state.nationalCollapseOmniSingularityConsolidationIndex === collapseOmniSingularityConsolidation.nationalIndex,
    `omni consolidation ${composite.state.nationalCollapseOmniSingularityConsolidationIndex}`,
  );

  const voidTotalErosionDissolution = op10mA11ComputeInterregionalVoidTotalErosionDissolution({
    voidTotalErosionElimination: composite.state.voidTotalErosionElimination,
    collapseOmniSingularityUnification: composite.state.collapseOmniSingularityUnification,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_322',
    composite.state.voidTotalErosionDissolution.length === 8 &&
      composite.state.nationalVoidTotalErosionDissolutionIndex === voidTotalErosionDissolution.nationalIndex,
    `erosion dissolution ${composite.state.nationalVoidTotalErosionDissolutionIndex}`,
  );

  const existentialAbsoluteNullityImmutability = op10mA11ComputeSettlementExistentialAbsoluteNullityImmutability({
    existentialAbsoluteNullityPerpetuity: composite.state.existentialAbsoluteNullityPerpetuity,
    collapseOmniSingularityUnification: composite.state.collapseOmniSingularityUnification,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_323',
    composite.state.existentialAbsoluteNullityImmutability.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityImmutabilityIndex === existentialAbsoluteNullityImmutability.nationalIndex,
    `nullity immutability ${composite.state.nationalExistentialAbsoluteNullityImmutabilityIndex}`,
  );

  push(
    out,
    'a11_324',
    composite.state.collapseOmniSingularityConsolidation.every((c) => c.narrative.includes('collapse omni singularity consolidation')),
    composite.state.collapseOmniSingularityConsolidation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_325',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_consolidation') ||
      composite.state.collapseOmniSingularityConsolidation.some((c) => c.band === 'total' || c.band === 'consolidation'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_326',
    composite.derived.some((d) => d.kind === 'void_total_erosion_dissolution') ||
      composite.state.voidTotalErosionDissolution.some((d) => d.band === 'total' || d.band === 'complete_dissolution'),
    composite.state.voidTotalErosionDissolution[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_327',
    composite.persisted.lastVoidTotalErosionDissolutionIndex === composite.state.nationalVoidTotalErosionDissolutionIndex,
    `persisted dissolution ${composite.persisted.lastVoidTotalErosionDissolutionIndex}`,
  );

  push(
    out,
    'a11_328',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_immutability') ||
      composite.state.existentialAbsoluteNullityImmutability.some((i) => i.band === 'absolute' || i.band === 'total_immutability'),
    composite.state.existentialAbsoluteNullityImmutability[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_329',
    composite.state.existentialAbsoluteNullityImmutability.every((i) => i.narrative.includes('existential absolute nullity immutability')),
    composite.state.existentialAbsoluteNullityImmutability[0]?.band ?? 'none',
  );

  const collapseOmniSingularityCoalescence = op10mA11ComputeRegionalCollapseOmniSingularityCoalescence({
    collapseOmniSingularityConsolidation: composite.state.collapseOmniSingularityConsolidation,
    voidTotalErosionDissolution: composite.state.voidTotalErosionDissolution,
    existentialAbsoluteNullityImmutability: composite.state.existentialAbsoluteNullityImmutability,
  });
  push(
    out,
    'a11_330',
    composite.state.collapseOmniSingularityCoalescence.length === 8 &&
      composite.state.nationalCollapseOmniSingularityCoalescenceIndex === collapseOmniSingularityCoalescence.nationalIndex,
    `omni coalescence ${composite.state.nationalCollapseOmniSingularityCoalescenceIndex}`,
  );

  const voidTotalErosionSublimation = op10mA11ComputeInterregionalVoidTotalErosionSublimation({
    voidTotalErosionDissolution: composite.state.voidTotalErosionDissolution,
    collapseOmniSingularityConsolidation: composite.state.collapseOmniSingularityConsolidation,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_331',
    composite.state.voidTotalErosionSublimation.length === 8 &&
      composite.state.nationalVoidTotalErosionSublimationIndex === voidTotalErosionSublimation.nationalIndex,
    `erosion sublimation ${composite.state.nationalVoidTotalErosionSublimationIndex}`,
  );

  const existentialAbsoluteNullityPermanence = op10mA11ComputeSettlementExistentialAbsoluteNullityPermanence({
    existentialAbsoluteNullityImmutability: composite.state.existentialAbsoluteNullityImmutability,
    collapseOmniSingularityConsolidation: composite.state.collapseOmniSingularityConsolidation,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_332',
    composite.state.existentialAbsoluteNullityPermanence.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityPermanenceIndex === existentialAbsoluteNullityPermanence.nationalIndex,
    `nullity permanence ${composite.state.nationalExistentialAbsoluteNullityPermanenceIndex}`,
  );

  push(
    out,
    'a11_333',
    composite.state.collapseOmniSingularityCoalescence.every((c) => c.narrative.includes('collapse omni singularity coalescence')),
    composite.state.collapseOmniSingularityCoalescence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_334',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_coalescence') ||
      composite.state.collapseOmniSingularityCoalescence.some((c) => c.band === 'total' || c.band === 'coalescence'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_335',
    composite.derived.some((d) => d.kind === 'void_total_erosion_sublimation') ||
      composite.state.voidTotalErosionSublimation.some((s) => s.band === 'total' || s.band === 'complete_sublimation'),
    composite.state.voidTotalErosionSublimation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_336',
    composite.persisted.lastVoidTotalErosionSublimationIndex === composite.state.nationalVoidTotalErosionSublimationIndex,
    `persisted sublimation ${composite.persisted.lastVoidTotalErosionSublimationIndex}`,
  );

  push(
    out,
    'a11_337',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_permanence') ||
      composite.state.existentialAbsoluteNullityPermanence.some((p) => p.band === 'absolute' || p.band === 'total_permanence'),
    composite.state.existentialAbsoluteNullityPermanence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_338',
    composite.state.existentialAbsoluteNullityPermanence.every((p) => p.narrative.includes('existential absolute nullity permanence')),
    composite.state.existentialAbsoluteNullityPermanence[0]?.band ?? 'none',
  );

  const collapseOmniSingularityAmalgamation = op10mA11ComputeRegionalCollapseOmniSingularityAmalgamation({
    collapseOmniSingularityCoalescence: composite.state.collapseOmniSingularityCoalescence,
    voidTotalErosionSublimation: composite.state.voidTotalErosionSublimation,
    existentialAbsoluteNullityPermanence: composite.state.existentialAbsoluteNullityPermanence,
  });
  push(out, 'a11_339', composite.state.collapseOmniSingularityAmalgamation.length === 8 && composite.state.nationalCollapseOmniSingularityAmalgamationIndex === collapseOmniSingularityAmalgamation.nationalIndex, `omni amalgamation ${composite.state.nationalCollapseOmniSingularityAmalgamationIndex}`);

  const voidTotalErosionAtomization = op10mA11ComputeInterregionalVoidTotalErosionAtomization({
    voidTotalErosionSublimation: composite.state.voidTotalErosionSublimation,
    collapseOmniSingularityCoalescence: composite.state.collapseOmniSingularityCoalescence,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_340', composite.state.voidTotalErosionAtomization.length === 8 && composite.state.nationalVoidTotalErosionAtomizationIndex === voidTotalErosionAtomization.nationalIndex, `erosion atomization ${composite.state.nationalVoidTotalErosionAtomizationIndex}`);

  const existentialAbsoluteNullityInevitability = op10mA11ComputeSettlementExistentialAbsoluteNullityInevitability({
    existentialAbsoluteNullityPermanence: composite.state.existentialAbsoluteNullityPermanence,
    collapseOmniSingularityCoalescence: composite.state.collapseOmniSingularityCoalescence,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_341', composite.state.existentialAbsoluteNullityInevitability.length === 8 && composite.state.nationalExistentialAbsoluteNullityInevitabilityIndex === existentialAbsoluteNullityInevitability.nationalIndex, `nullity inevitability ${composite.state.nationalExistentialAbsoluteNullityInevitabilityIndex}`);

  push(out, 'a11_342', composite.state.collapseOmniSingularityAmalgamation.every((a) => a.narrative.includes('collapse omni singularity amalgamation')), composite.state.collapseOmniSingularityAmalgamation[0]?.band ?? 'none');
  push(out, 'a11_343', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_amalgamation') || composite.state.collapseOmniSingularityAmalgamation.some((a) => a.band === 'total' || a.band === 'amalgamation'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_344', composite.derived.some((d) => d.kind === 'void_total_erosion_atomization') || composite.state.voidTotalErosionAtomization.some((a) => a.band === 'total' || a.band === 'complete_atomization'), composite.state.voidTotalErosionAtomization[0]?.band ?? 'none');
  push(out, 'a11_345', composite.persisted.lastVoidTotalErosionAtomizationIndex === composite.state.nationalVoidTotalErosionAtomizationIndex, `persisted atomization ${composite.persisted.lastVoidTotalErosionAtomizationIndex}`);
  push(out, 'a11_346', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_inevitability') || composite.state.existentialAbsoluteNullityInevitability.some((i) => i.band === 'absolute' || i.band === 'total_inevitability'), composite.state.existentialAbsoluteNullityInevitability[0]?.band ?? 'none');
  push(out, 'a11_347', composite.state.existentialAbsoluteNullityInevitability.every((i) => i.narrative.includes('existential absolute nullity inevitability')), composite.state.existentialAbsoluteNullityInevitability[0]?.band ?? 'none');

  const collapseOmniSingularitySymbiosis = op10mA11ComputeRegionalCollapseOmniSingularitySymbiosis({
    collapseOmniSingularityAmalgamation: composite.state.collapseOmniSingularityAmalgamation,
    voidTotalErosionAtomization: composite.state.voidTotalErosionAtomization,
    existentialAbsoluteNullityInevitability: composite.state.existentialAbsoluteNullityInevitability,
  });
  push(out, 'a11_348', composite.state.collapseOmniSingularitySymbiosis.length === 8 && composite.state.nationalCollapseOmniSingularitySymbiosisIndex === collapseOmniSingularitySymbiosis.nationalIndex, `omni symbiosis ${composite.state.nationalCollapseOmniSingularitySymbiosisIndex}`);

  const voidTotalErosionPulverization = op10mA11ComputeInterregionalVoidTotalErosionPulverization({
    voidTotalErosionAtomization: composite.state.voidTotalErosionAtomization,
    collapseOmniSingularityAmalgamation: composite.state.collapseOmniSingularityAmalgamation,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_349', composite.state.voidTotalErosionPulverization.length === 8 && composite.state.nationalVoidTotalErosionPulverizationIndex === voidTotalErosionPulverization.nationalIndex, `erosion pulverization ${composite.state.nationalVoidTotalErosionPulverizationIndex}`);

  const existentialAbsoluteNullityDeterminism = op10mA11ComputeSettlementExistentialAbsoluteNullityDeterminism({
    existentialAbsoluteNullityInevitability: composite.state.existentialAbsoluteNullityInevitability,
    collapseOmniSingularityAmalgamation: composite.state.collapseOmniSingularityAmalgamation,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_350', composite.state.existentialAbsoluteNullityDeterminism.length === 8 && composite.state.nationalExistentialAbsoluteNullityDeterminismIndex === existentialAbsoluteNullityDeterminism.nationalIndex, `nullity determinism ${composite.state.nationalExistentialAbsoluteNullityDeterminismIndex}`);

  push(out, 'a11_351', composite.state.collapseOmniSingularitySymbiosis.every((s) => s.narrative.includes('collapse omni singularity symbiosis')), composite.state.collapseOmniSingularitySymbiosis[0]?.band ?? 'none');
  push(out, 'a11_352', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_symbiosis') || composite.state.collapseOmniSingularitySymbiosis.some((s) => s.band === 'total' || s.band === 'symbiosis'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_353', composite.derived.some((d) => d.kind === 'void_total_erosion_pulverization') || composite.state.voidTotalErosionPulverization.some((p) => p.band === 'total' || p.band === 'complete_pulverization'), composite.state.voidTotalErosionPulverization[0]?.band ?? 'none');
  push(out, 'a11_354', composite.persisted.lastVoidTotalErosionPulverizationIndex === composite.state.nationalVoidTotalErosionPulverizationIndex, `persisted pulverization ${composite.persisted.lastVoidTotalErosionPulverizationIndex}`);
  push(out, 'a11_355', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_determinism') || composite.state.existentialAbsoluteNullityDeterminism.some((d) => d.band === 'absolute' || d.band === 'total_determinism'), composite.state.existentialAbsoluteNullityDeterminism[0]?.band ?? 'none');
  push(out, 'a11_356', composite.state.existentialAbsoluteNullityDeterminism.every((d) => d.narrative.includes('existential absolute nullity determinism')), composite.state.existentialAbsoluteNullityDeterminism[0]?.band ?? 'none');

  const collapseOmniSingularityHolism = op10mA11ComputeRegionalCollapseOmniSingularityHolism({
    collapseOmniSingularitySymbiosis: composite.state.collapseOmniSingularitySymbiosis,
    voidTotalErosionPulverization: composite.state.voidTotalErosionPulverization,
    existentialAbsoluteNullityDeterminism: composite.state.existentialAbsoluteNullityDeterminism,
  });
  push(out, 'a11_357', composite.state.collapseOmniSingularityHolism.length === 8 && composite.state.nationalCollapseOmniSingularityHolismIndex === collapseOmniSingularityHolism.nationalIndex, `omni holism ${composite.state.nationalCollapseOmniSingularityHolismIndex}`);

  const voidTotalErosionGranulation = op10mA11ComputeInterregionalVoidTotalErosionGranulation({
    voidTotalErosionPulverization: composite.state.voidTotalErosionPulverization,
    collapseOmniSingularitySymbiosis: composite.state.collapseOmniSingularitySymbiosis,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_358', composite.state.voidTotalErosionGranulation.length === 8 && composite.state.nationalVoidTotalErosionGranulationIndex === voidTotalErosionGranulation.nationalIndex, `erosion granulation ${composite.state.nationalVoidTotalErosionGranulationIndex}`);

  const existentialAbsoluteNullityCertitude = op10mA11ComputeSettlementExistentialAbsoluteNullityCertitude({
    existentialAbsoluteNullityDeterminism: composite.state.existentialAbsoluteNullityDeterminism,
    collapseOmniSingularitySymbiosis: composite.state.collapseOmniSingularitySymbiosis,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_359', composite.state.existentialAbsoluteNullityCertitude.length === 8 && composite.state.nationalExistentialAbsoluteNullityCertitudeIndex === existentialAbsoluteNullityCertitude.nationalIndex, `nullity certitude ${composite.state.nationalExistentialAbsoluteNullityCertitudeIndex}`);

  push(out, 'a11_360', composite.state.collapseOmniSingularityHolism.every((h) => h.narrative.includes('collapse omni singularity holism')), composite.state.collapseOmniSingularityHolism[0]?.band ?? 'none');
  push(out, 'a11_361', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_holism') || composite.state.collapseOmniSingularityHolism.some((h) => h.band === 'total' || h.band === 'holism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_362', composite.derived.some((d) => d.kind === 'void_total_erosion_granulation') || composite.state.voidTotalErosionGranulation.some((g) => g.band === 'total' || g.band === 'complete_granulation'), composite.state.voidTotalErosionGranulation[0]?.band ?? 'none');
  push(out, 'a11_363', composite.persisted.lastVoidTotalErosionGranulationIndex === composite.state.nationalVoidTotalErosionGranulationIndex, `persisted granulation ${composite.persisted.lastVoidTotalErosionGranulationIndex}`);
  push(out, 'a11_364', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_certitude') || composite.state.existentialAbsoluteNullityCertitude.some((c) => c.band === 'absolute' || c.band === 'total_certitude'), composite.state.existentialAbsoluteNullityCertitude[0]?.band ?? 'none');
  push(out, 'a11_365', composite.state.existentialAbsoluteNullityCertitude.every((c) => c.narrative.includes('existential absolute nullity certitude')), composite.state.existentialAbsoluteNullityCertitude[0]?.band ?? 'none');

  const collapseOmniSingularityMonism = op10mA11ComputeRegionalCollapseOmniSingularityMonism({
    collapseOmniSingularityHolism: composite.state.collapseOmniSingularityHolism,
    voidTotalErosionGranulation: composite.state.voidTotalErosionGranulation,
    existentialAbsoluteNullityCertitude: composite.state.existentialAbsoluteNullityCertitude,
  });
  push(out, 'a11_366', composite.state.collapseOmniSingularityMonism.length === 8 && composite.state.nationalCollapseOmniSingularityMonismIndex === collapseOmniSingularityMonism.nationalIndex, `omni monism ${composite.state.nationalCollapseOmniSingularityMonismIndex}`);

  const voidTotalErosionComminution = op10mA11ComputeInterregionalVoidTotalErosionComminution({
    voidTotalErosionGranulation: composite.state.voidTotalErosionGranulation,
    collapseOmniSingularityHolism: composite.state.collapseOmniSingularityHolism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_367', composite.state.voidTotalErosionComminution.length === 8 && composite.state.nationalVoidTotalErosionComminutionIndex === voidTotalErosionComminution.nationalIndex, `erosion comminution ${composite.state.nationalVoidTotalErosionComminutionIndex}`);

  const existentialAbsoluteNullityConviction = op10mA11ComputeSettlementExistentialAbsoluteNullityConviction({
    existentialAbsoluteNullityCertitude: composite.state.existentialAbsoluteNullityCertitude,
    collapseOmniSingularityHolism: composite.state.collapseOmniSingularityHolism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_368', composite.state.existentialAbsoluteNullityConviction.length === 8 && composite.state.nationalExistentialAbsoluteNullityConvictionIndex === existentialAbsoluteNullityConviction.nationalIndex, `nullity conviction ${composite.state.nationalExistentialAbsoluteNullityConvictionIndex}`);

  push(out, 'a11_369', composite.state.collapseOmniSingularityMonism.every((m) => m.narrative.includes('collapse omni singularity monism')), composite.state.collapseOmniSingularityMonism[0]?.band ?? 'none');
  push(out, 'a11_370', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_monism') || composite.state.collapseOmniSingularityMonism.some((m) => m.band === 'total' || m.band === 'monism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_371', composite.derived.some((d) => d.kind === 'void_total_erosion_comminution') || composite.state.voidTotalErosionComminution.some((c) => c.band === 'total' || c.band === 'complete_comminution'), composite.state.voidTotalErosionComminution[0]?.band ?? 'none');
  push(out, 'a11_372', composite.persisted.lastVoidTotalErosionComminutionIndex === composite.state.nationalVoidTotalErosionComminutionIndex, `persisted comminution ${composite.persisted.lastVoidTotalErosionComminutionIndex}`);
  push(out, 'a11_373', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_conviction') || composite.state.existentialAbsoluteNullityConviction.some((c) => c.band === 'absolute' || c.band === 'total_conviction'), composite.state.existentialAbsoluteNullityConviction[0]?.band ?? 'none');
  push(out, 'a11_374', composite.state.existentialAbsoluteNullityConviction.every((c) => c.narrative.includes('existential absolute nullity conviction')), composite.state.existentialAbsoluteNullityConviction[0]?.band ?? 'none');

  const collapseOmniSingularityTotalism = op10mA11ComputeRegionalCollapseOmniSingularityTotalism({
    collapseOmniSingularityMonism: composite.state.collapseOmniSingularityMonism,
    voidTotalErosionComminution: composite.state.voidTotalErosionComminution,
    existentialAbsoluteNullityConviction: composite.state.existentialAbsoluteNullityConviction,
  });
  push(out, 'a11_375', composite.state.collapseOmniSingularityTotalism.length === 8 && composite.state.nationalCollapseOmniSingularityTotalismIndex === collapseOmniSingularityTotalism.nationalIndex, `omni totalism ${composite.state.nationalCollapseOmniSingularityTotalismIndex}`);

  const voidTotalErosionAttrition = op10mA11ComputeInterregionalVoidTotalErosionAttrition({
    voidTotalErosionComminution: composite.state.voidTotalErosionComminution,
    collapseOmniSingularityMonism: composite.state.collapseOmniSingularityMonism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_376', composite.state.voidTotalErosionAttrition.length === 8 && composite.state.nationalVoidTotalErosionAttritionIndex === voidTotalErosionAttrition.nationalIndex, `erosion attrition ${composite.state.nationalVoidTotalErosionAttritionIndex}`);

  const existentialAbsoluteNullityFinality = op10mA11ComputeSettlementExistentialAbsoluteNullityFinality({
    existentialAbsoluteNullityConviction: composite.state.existentialAbsoluteNullityConviction,
    collapseOmniSingularityMonism: composite.state.collapseOmniSingularityMonism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_377', composite.state.existentialAbsoluteNullityFinality.length === 8 && composite.state.nationalExistentialAbsoluteNullityFinalityIndex === existentialAbsoluteNullityFinality.nationalIndex, `nullity finality ${composite.state.nationalExistentialAbsoluteNullityFinalityIndex}`);

  push(out, 'a11_378', composite.state.collapseOmniSingularityTotalism.every((t) => t.narrative.includes('collapse omni singularity totalism')), composite.state.collapseOmniSingularityTotalism[0]?.band ?? 'none');
  push(out, 'a11_379', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_totalism') || composite.state.collapseOmniSingularityTotalism.some((t) => t.band === 'total' || t.band === 'totalism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_380', composite.derived.some((d) => d.kind === 'void_total_erosion_attrition') || composite.state.voidTotalErosionAttrition.some((a) => a.band === 'total' || a.band === 'complete_attrition'), composite.state.voidTotalErosionAttrition[0]?.band ?? 'none');
  push(out, 'a11_381', composite.persisted.lastVoidTotalErosionAttritionIndex === composite.state.nationalVoidTotalErosionAttritionIndex, `persisted attrition ${composite.persisted.lastVoidTotalErosionAttritionIndex}`);
  push(out, 'a11_382', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_finality') || composite.state.existentialAbsoluteNullityFinality.some((f) => f.band === 'absolute' || f.band === 'total_finality'), composite.state.existentialAbsoluteNullityFinality[0]?.band ?? 'none');
  push(out, 'a11_383', composite.state.existentialAbsoluteNullityFinality.every((f) => f.narrative.includes('existential absolute nullity finality')), composite.state.existentialAbsoluteNullityFinality[0]?.band ?? 'none');

  const collapseOmniSingularityUniversalism = op10mA11ComputeRegionalCollapseOmniSingularityUniversalism({
    collapseOmniSingularityTotalism: composite.state.collapseOmniSingularityTotalism,
    voidTotalErosionAttrition: composite.state.voidTotalErosionAttrition,
    existentialAbsoluteNullityFinality: composite.state.existentialAbsoluteNullityFinality,
  });
  push(out, 'a11_384', composite.state.collapseOmniSingularityUniversalism.length === 8 && composite.state.nationalCollapseOmniSingularityUniversalismIndex === collapseOmniSingularityUniversalism.nationalIndex, `omni universalism ${composite.state.nationalCollapseOmniSingularityUniversalismIndex}`);

  const voidTotalErosionAblation = op10mA11ComputeInterregionalVoidTotalErosionAblation({
    voidTotalErosionAttrition: composite.state.voidTotalErosionAttrition,
    collapseOmniSingularityTotalism: composite.state.collapseOmniSingularityTotalism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_385', composite.state.voidTotalErosionAblation.length === 8 && composite.state.nationalVoidTotalErosionAblationIndex === voidTotalErosionAblation.nationalIndex, `erosion ablation ${composite.state.nationalVoidTotalErosionAblationIndex}`);

  const existentialAbsoluteNullitySealing = op10mA11ComputeSettlementExistentialAbsoluteNullitySealing({
    existentialAbsoluteNullityFinality: composite.state.existentialAbsoluteNullityFinality,
    collapseOmniSingularityTotalism: composite.state.collapseOmniSingularityTotalism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_386', composite.state.existentialAbsoluteNullitySealing.length === 8 && composite.state.nationalExistentialAbsoluteNullitySealingIndex === existentialAbsoluteNullitySealing.nationalIndex, `nullity sealing ${composite.state.nationalExistentialAbsoluteNullitySealingIndex}`);

  push(out, 'a11_387', composite.state.collapseOmniSingularityUniversalism.every((u) => u.narrative.includes('collapse omni singularity universalism')), composite.state.collapseOmniSingularityUniversalism[0]?.band ?? 'none');
  push(out, 'a11_388', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_universalism') || composite.state.collapseOmniSingularityUniversalism.some((u) => u.band === 'total' || u.band === 'universalism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_389', composite.derived.some((d) => d.kind === 'void_total_erosion_ablation') || composite.state.voidTotalErosionAblation.some((a) => a.band === 'total' || a.band === 'complete_ablation'), composite.state.voidTotalErosionAblation[0]?.band ?? 'none');
  push(out, 'a11_390', composite.persisted.lastVoidTotalErosionAblationIndex === composite.state.nationalVoidTotalErosionAblationIndex, `persisted ablation ${composite.persisted.lastVoidTotalErosionAblationIndex}`);
  push(out, 'a11_391', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_sealing') || composite.state.existentialAbsoluteNullitySealing.some((s) => s.band === 'absolute' || s.band === 'total_sealing'), composite.state.existentialAbsoluteNullitySealing[0]?.band ?? 'none');
  push(out, 'a11_392', composite.state.existentialAbsoluteNullitySealing.every((s) => s.narrative.includes('existential absolute nullity sealing')), composite.state.existentialAbsoluteNullitySealing[0]?.band ?? 'none');
  const collapseOmniSingularityCosmism = op10mA11ComputeRegionalCollapseOmniSingularityCosmism({
    collapseOmniSingularityUniversalism: composite.state.collapseOmniSingularityUniversalism,
    voidTotalErosionAblation: composite.state.voidTotalErosionAblation,
    existentialAbsoluteNullitySealing: composite.state.existentialAbsoluteNullitySealing,
  });
  push(out, 'a11_393', composite.state.collapseOmniSingularityCosmism.length === 8 && composite.state.nationalCollapseOmniSingularityCosmismIndex === collapseOmniSingularityCosmism.nationalIndex, `omni cosmism ${composite.state.nationalCollapseOmniSingularityCosmismIndex}`);

  const voidTotalErosionDepletion = op10mA11ComputeInterregionalVoidTotalErosionDepletion({
    voidTotalErosionAblation: composite.state.voidTotalErosionAblation,
    collapseOmniSingularityUniversalism: composite.state.collapseOmniSingularityUniversalism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_394', composite.state.voidTotalErosionDepletion.length === 8 && composite.state.nationalVoidTotalErosionDepletionIndex === voidTotalErosionDepletion.nationalIndex, `erosion depletion ${composite.state.nationalVoidTotalErosionDepletionIndex}`);

  const existentialAbsoluteNullityRatification = op10mA11ComputeSettlementExistentialAbsoluteNullityRatification({
    existentialAbsoluteNullitySealing: composite.state.existentialAbsoluteNullitySealing,
    collapseOmniSingularityUniversalism: composite.state.collapseOmniSingularityUniversalism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_395', composite.state.existentialAbsoluteNullityRatification.length === 8 && composite.state.nationalExistentialAbsoluteNullityRatificationIndex === existentialAbsoluteNullityRatification.nationalIndex, `nullity ratification ${composite.state.nationalExistentialAbsoluteNullityRatificationIndex}`);

  push(out, 'a11_396', composite.state.collapseOmniSingularityCosmism.every((c) => c.narrative.includes('collapse omni singularity cosmism')), composite.state.collapseOmniSingularityCosmism[0]?.band ?? 'none');
  push(out, 'a11_397', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_cosmism') || composite.state.collapseOmniSingularityCosmism.some((c) => c.band === 'total' || c.band === 'cosmism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_398', composite.derived.some((d) => d.kind === 'void_total_erosion_depletion') || composite.state.voidTotalErosionDepletion.some((d) => d.band === 'total' || d.band === 'complete_depletion'), composite.state.voidTotalErosionDepletion[0]?.band ?? 'none');
  push(out, 'a11_399', composite.persisted.lastVoidTotalErosionDepletionIndex === composite.state.nationalVoidTotalErosionDepletionIndex, `persisted depletion ${composite.persisted.lastVoidTotalErosionDepletionIndex}`);
  push(out, 'a11_400', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_ratification') || composite.state.existentialAbsoluteNullityRatification.some((r) => r.band === 'absolute' || r.band === 'total_ratification'), composite.state.existentialAbsoluteNullityRatification[0]?.band ?? 'none');
  push(out, 'a11_401', composite.state.existentialAbsoluteNullityRatification.every((r) => r.narrative.includes('existential absolute nullity ratification')), composite.state.existentialAbsoluteNullityRatification[0]?.band ?? 'none');
  const collapseOmniSingularityPantheism = op10mA11ComputeRegionalCollapseOmniSingularityPantheism({
    collapseOmniSingularityCosmism: composite.state.collapseOmniSingularityCosmism,
    voidTotalErosionDepletion: composite.state.voidTotalErosionDepletion,
    existentialAbsoluteNullityRatification: composite.state.existentialAbsoluteNullityRatification,
  });
  push(out, 'a11_402', composite.state.collapseOmniSingularityPantheism.length === 8 && composite.state.nationalCollapseOmniSingularityPantheismIndex === collapseOmniSingularityPantheism.nationalIndex, `omni pantheism ${composite.state.nationalCollapseOmniSingularityPantheismIndex}`);

  const voidTotalErosionExhaustion = op10mA11ComputeInterregionalVoidTotalErosionExhaustion({
    voidTotalErosionDepletion: composite.state.voidTotalErosionDepletion,
    collapseOmniSingularityCosmism: composite.state.collapseOmniSingularityCosmism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_403', composite.state.voidTotalErosionExhaustion.length === 8 && composite.state.nationalVoidTotalErosionExhaustionIndex === voidTotalErosionExhaustion.nationalIndex, `erosion exhaustion ${composite.state.nationalVoidTotalErosionExhaustionIndex}`);

  const existentialAbsoluteNullityCanonization = op10mA11ComputeSettlementExistentialAbsoluteNullityCanonization({
    existentialAbsoluteNullityRatification: composite.state.existentialAbsoluteNullityRatification,
    collapseOmniSingularityCosmism: composite.state.collapseOmniSingularityCosmism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_404', composite.state.existentialAbsoluteNullityCanonization.length === 8 && composite.state.nationalExistentialAbsoluteNullityCanonizationIndex === existentialAbsoluteNullityCanonization.nationalIndex, `nullity canonization ${composite.state.nationalExistentialAbsoluteNullityCanonizationIndex}`);

  push(out, 'a11_405', composite.state.collapseOmniSingularityPantheism.every((p) => p.narrative.includes('collapse omni singularity pantheism')), composite.state.collapseOmniSingularityPantheism[0]?.band ?? 'none');
  push(out, 'a11_406', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_pantheism') || composite.state.collapseOmniSingularityPantheism.some((p) => p.band === 'total' || p.band === 'pantheism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_407', composite.derived.some((d) => d.kind === 'void_total_erosion_exhaustion') || composite.state.voidTotalErosionExhaustion.some((e) => e.band === 'total' || e.band === 'complete_exhaustion'), composite.state.voidTotalErosionExhaustion[0]?.band ?? 'none');
  push(out, 'a11_408', composite.persisted.lastVoidTotalErosionExhaustionIndex === composite.state.nationalVoidTotalErosionExhaustionIndex, `persisted exhaustion ${composite.persisted.lastVoidTotalErosionExhaustionIndex}`);
  push(out, 'a11_409', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_canonization') || composite.state.existentialAbsoluteNullityCanonization.some((c) => c.band === 'absolute' || c.band === 'total_canonization'), composite.state.existentialAbsoluteNullityCanonization[0]?.band ?? 'none');
  push(out, 'a11_410', composite.state.existentialAbsoluteNullityCanonization.every((c) => c.narrative.includes('existential absolute nullity canonization')), composite.state.existentialAbsoluteNullityCanonization[0]?.band ?? 'none');

  return out;
}

export function assertOP10M_A11_SelfTests(): { ok: boolean; failed: OP10M_A11_SelfTestResult[] } {
  const results = runOP10M_A11_SelfTests();
  const failed = results.filter((r) => !r.passed);
  return { ok: failed.length === 0, failed };
}
