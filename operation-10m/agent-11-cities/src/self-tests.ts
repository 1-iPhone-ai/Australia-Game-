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
    composite.state.maxCorridorFlow > 0 && composite.state.schemaVersion === '10m.a11.composite.21',
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
      composite.persisted.lastExistentialContinuityFractureIndex === composite.state.nationalExistentialContinuityFractureIndex,
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

  return out;
}

export function assertOP10M_A11_SelfTests(): { ok: boolean; failed: OP10M_A11_SelfTestResult[] } {
  const results = runOP10M_A11_SelfTests();
  const failed = results.filter((r) => !r.passed);
  return { ok: failed.length === 0, failed };
}
