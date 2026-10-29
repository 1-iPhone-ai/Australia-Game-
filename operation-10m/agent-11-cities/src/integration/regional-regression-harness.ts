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
    irrecoverableCollapseStable;
  const detail = ok
    ? `${turns}-turn harness: revisions 1..${turns}, cohesion ${snapshots[0].cohesionIndex}→${snapshots[snapshots.length - 1].cohesionIndex}, collapse threshold ${snapshots[snapshots.length - 1].irrecoverableCollapseThresholdIndex}`
    : `harness failed: revision=${monotonicRevision} valid=${allValid} cohesion=${cohesionStable} equity=${serviceEquityStable} spread=${spreadStable} backlog=${backlogStable} governance=${governanceStable} housing=${housingStable} climate=${climateStable} amenity=${amenityStable} relocation=${relocationStable} anchor=${employmentAnchorStable} commute=${commuteWedgeStable} reception=${receptionStrainStable} gridlock=${landUseGridlockStable} trap=${mobilityTrapStable} gap=${absorptionGapStable} relief=${reliefOverheadStable} drift=${corridorDriftStable} lag=${adaptationLagStable} fiscal=${fiscalCapacityStable} erosion=${networkErosionStable} horizon=${horizonRiskStable} integrity=${cohesionIntegrityStable} reliefEq=${reliefEquityGapStable} systemic=${systemicFragilityStable} govDecay=${governanceDecayStable} migStab=${migrationStabilityStable} ceiling=${adaptiveCeilingStable} fiscalGov=${fiscalGovernanceCouplingStable} netEq=${networkEquityTensionStable} frontier=${resilienceFrontierStable} metaGov=${metaGovernanceFatigueStable} capital=${capitalMobilityStable} compound=${compoundShockStable} trust=${institutionalTrustStable} liquidity=${liquidityFragmentationStable} cascade=${cascadingFailureStable} social=${socialContractStable} flight=${capitalFlightStable} irrecoverable=${irrecoverableCollapseStable}`;

  return { ok, snapshots, detail };
}
