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
  base.inputHash = op10mA11HashInputs({
    turn: inputs.urban.turn,
    cityCount: inputs.urban.cities.length,
    regionKeys: 'composite',
    nationalGrowth: `${fragilityIndex}:${nationalPrimateIndex}:${maxCorridorFlow}:${regionalCohesionIndex}:${metropolitanSaturationIndex}:${backlogOut.nationalIndex}:${housingSpilloverOut.nationalIndex}:${climateOut.nationalIndex}:${amenityOut.nationalIndex}:${relocationOut.nationalIndex}:${employmentAnchorOut.nationalIndex}:${commuteWedgeOut.nationalIndex}:${receptionStrainOut.nationalIndex}`,
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
    summary: `${urbanOut.state.summary} ${infraOut.state.summary} Fragility ${fragilityIndex}; primate ${nationalPrimateIndex}; peak flow ${maxCorridorFlow}; cohesion ${regionalCohesionIndex}; saturation ${metropolitanSaturationIndex}; service equity ${serviceEquityOut.nationalIndex}; backlog ${backlogOut.nationalIndex}; governance ${governanceOut.nationalIndex}; housing spillover ${housingSpilloverOut.nationalIndex}; talent drain ${talentOut.nationalIndex}; climate displacement ${climateOut.nationalIndex}; amenity cost ${amenityOut.nationalIndex}; decentralization ${decentralOut.nationalIndex}; relocation burden ${relocationOut.nationalIndex}; employment anchor ${employmentAnchorOut.nationalIndex}; commute wedge ${commuteWedgeOut.nationalIndex}; reception strain ${receptionStrainOut.nationalIndex}.`,
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
