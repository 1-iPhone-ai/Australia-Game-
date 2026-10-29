import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';
import { makeDefaultMacroFinancialTestInputs, computeNationalMacroFinancialConditions } from '../compute/national-macro-financial.js';
import { stepInflationExpectations, initialInflationAnchoringScore } from '../inflation/expectations-anchor.js';
import { assessWagePriceSpiral } from '../inflation/wage-price-spiral.js';
import { decomposeMacroCpiBasket } from '../inflation/cpi-basket.js';
import { serviceCostPassThroughFromAffordability } from '../inflation/pass-through.js';
import { computeCoreHeadlineSpread } from '../inflation/core-headline-spread.js';
import {
  stepInflationRegimeTracker,
  createInitialInflationRegimeTracker,
  type InflationRegimeLabel,
} from './inflation-regime-tracker.js';
import {
  createInitialInflationMomentumState,
  stepInflationMomentum,
  type InflationMomentumSnapshot,
} from '../inflation/inflation-momentum.js';
import {
  assessImportPricePassThrough,
  type ImportPassThroughBand,
} from '../inflation/import-price-pass-through.js';
import {
  assessTermPremiumInflationSignal,
  type TermPremiumSignalBand,
} from '../rates/term-premium-inflation-signal.js';
import {
  assessEnergyPricePassThrough,
  type EnergyPassThroughBand,
} from '../inflation/energy-price-pass-through.js';
import {
  assessShelterRentInflation,
  type ShelterRentPressureBand,
} from '../inflation/shelter-rent-inflation.js';
import {
  assessFoodGroceryPassThrough,
  type FoodGroceryPassThroughBand,
} from '../inflation/food-grocery-pass-through.js';
import {
  assessTransportLogisticsInflation,
  type TransportLogisticsPressureBand,
} from '../inflation/transport-logistics-inflation.js';
import {
  assessHealthcareServicesInflation,
  type HealthcareServicesPressureBand,
} from '../inflation/healthcare-services-inflation.js';
import {
  assessInsurancePremiumPassThrough,
  type InsurancePremiumPassThroughBand,
} from '../inflation/insurance-premium-pass-through.js';
import {
  assessEducationTuitionInflation,
  type EducationTuitionPressureBand,
} from '../inflation/education-tuition-inflation.js';
import {
  assessCommunicationsServicesInflation,
  type CommunicationsServicesPressureBand,
} from '../inflation/communications-services-inflation.js';
import {
  assessRecreationLeisureInflation,
  type RecreationLeisurePressureBand,
} from '../inflation/recreation-leisure-inflation.js';
import {
  assessProfessionalServicesFeeInflation,
  type ProfessionalServicesFeeBand,
} from '../inflation/professional-services-fee-inflation.js';
import {
  assessChildcareServicesInflation,
  type ChildcareServicesPressureBand,
} from '../inflation/childcare-services-inflation.js';
import {
  assessGovernmentChargesInflation,
  type GovernmentChargesPressureBand,
} from '../inflation/government-charges-inflation.js';
import {
  assessWaterUtilitiesInflation,
  type WaterUtilitiesPressureBand,
} from '../inflation/water-utilities-inflation.js';
import {
  assessDomesticTravelInflation,
  type DomesticTravelPressureBand,
} from '../inflation/domestic-travel-inflation.js';
import {
  assessConstructionMaterialsInflation,
  type ConstructionMaterialsPressureBand,
} from '../inflation/construction-materials-inflation.js';
import {
  assessRetailTradeMarginInflation,
  type RetailTradeMarginBand,
} from '../inflation/retail-trade-margin-inflation.js';
import {
  assessFinancialServicesFeeInflation,
  type FinancialServicesFeeBand,
} from '../inflation/financial-services-fee-inflation.js';
import {
  assessAgriculturalFarmgateInflation,
  type AgriculturalFarmgatePressureBand,
} from '../inflation/agricultural-farmgate-inflation.js';
import {
  assessPublicUtilitiesGridTariffInflation,
  type PublicUtilitiesGridTariffBand,
} from '../inflation/public-utilities-grid-tariff-inflation.js';
import {
  assessUiInflationSaliencePassThrough,
  type UiInflationSalienceBand,
} from '../inflation/ui-inflation-salience-pass-through.js';
import {
  assessHousingMortgageEssentialInflation,
  type HousingMortgageEssentialBand,
} from '../inflation/housing-mortgage-essential-inflation.js';
import {
  assessMacroTransmissionMergeInflation,
  type MacroTransmissionMergeBand,
} from '../inflation/macro-transmission-merge-inflation.js';
import {
  assessDynamicEventsInflationSpillover,
  type DynamicEventsInflationSpilloverBand,
} from '../inflation/dynamic-events-inflation-spillover.js';
import {
  assessDashboardMapInflationOverlay,
  type DashboardMapInflationOverlayBand,
} from '../inflation/dashboard-map-inflation-overlay.js';
import {
  assessPublicFinanceDebtServiceInflation,
  type PublicFinanceDebtServiceBand,
} from '../inflation/public-finance-debt-service-inflation.js';
import {
  assessPopulationLaborWageInflation,
  type PopulationLaborWageBand,
} from '../inflation/population-labor-wage-inflation.js';
import {
  assessWholesaleEnergyTransitionInflation,
  type WholesaleEnergyTransitionBand,
} from '../inflation/wholesale-energy-transition-inflation.js';
import {
  assessUrbanRentDispersionInflation,
  type UrbanRentDispersionBand,
} from '../inflation/urban-rent-dispersion-inflation.js';
import {
  assessCorporatePricingPassThroughInflation,
  type CorporatePricingPassThroughBand,
} from '../inflation/corporate-pricing-pass-through-inflation.js';
import {
  assessTradeExchangeImportInflation,
  type TradeExchangeImportBand,
} from '../inflation/trade-exchange-import-inflation.js';

export interface InflationForecastPoint {
  turn: number;
  inflationBand: InflationConditionsBand;
  costMultiplier: number;
  anchoringScore: number;
  spiralRisk: ReturnType<typeof assessWagePriceSpiral>['spiralRisk'];
  headlineCpiIndex: number;
  coreCpiIndex: number;
  regime: InflationRegimeLabel;
  momentumScore: number;
  momentumDirection: InflationMomentumSnapshot['direction'];
  importPassThroughBand: ImportPassThroughBand;
  termPremiumSignalBand: TermPremiumSignalBand;
  energyPassThroughBand: EnergyPassThroughBand;
  shelterRentPressureBand: ShelterRentPressureBand;
  foodGroceryPassThroughBand: FoodGroceryPassThroughBand;
  transportLogisticsPressureBand: TransportLogisticsPressureBand;
  healthcareServicesPressureBand: HealthcareServicesPressureBand;
  insurancePremiumPassThroughBand: InsurancePremiumPassThroughBand;
  educationTuitionPressureBand: EducationTuitionPressureBand;
  communicationsServicesPressureBand: CommunicationsServicesPressureBand;
  recreationLeisurePressureBand: RecreationLeisurePressureBand;
  professionalServicesFeeBand: ProfessionalServicesFeeBand;
  childcareServicesPressureBand: ChildcareServicesPressureBand;
  governmentChargesPressureBand: GovernmentChargesPressureBand;
  waterUtilitiesPressureBand: WaterUtilitiesPressureBand;
  domesticTravelPressureBand: DomesticTravelPressureBand;
  constructionMaterialsPressureBand: ConstructionMaterialsPressureBand;
  retailTradeMarginBand: RetailTradeMarginBand;
  financialServicesFeeBand: FinancialServicesFeeBand;
  agriculturalFarmgatePressureBand: AgriculturalFarmgatePressureBand;
  publicUtilitiesGridTariffBand: PublicUtilitiesGridTariffBand;
  uiInflationSalienceBand: UiInflationSalienceBand;
  housingMortgageEssentialBand: HousingMortgageEssentialBand;
  macroTransmissionMergeBand: MacroTransmissionMergeBand;
  dynamicEventsInflationSpilloverBand: DynamicEventsInflationSpilloverBand;
  dashboardMapInflationOverlayBand: DashboardMapInflationOverlayBand;
  publicFinanceDebtServiceBand: PublicFinanceDebtServiceBand;
  populationLaborWageBand: PopulationLaborWageBand;
  wholesaleEnergyTransitionBand: WholesaleEnergyTransitionBand;
  urbanRentDispersionBand: UrbanRentDispersionBand;
  corporatePricingPassThroughBand: CorporatePricingPassThroughBand;
  tradeExchangeImportBand: TradeExchangeImportBand;
}

export interface InflationForecastPath {
  points: InflationForecastPoint[];
  terminalBand: InflationConditionsBand;
  maxCostMultiplier: number;
}

/** Deterministic forward path for dashboards / Agent 21 hooks (no RNG). */
export function projectInflationForecastPath(
  horizonTurns: number,
  seedInputs?: ReturnType<typeof makeDefaultMacroFinancialTestInputs>,
): InflationForecastPath {
  const points: InflationForecastPoint[] = [];
  let anchoring = initialInflationAnchoringScore();
  let maxCost = 1;
  let regimeState = createInitialInflationRegimeTracker();
  let momentumState = createInitialInflationMomentumState();

  for (let t = 1; t <= horizonTurns; t++) {
    const inputs = { ...(seedInputs ?? makeDefaultMacroFinancialTestInputs()), turn: t };
    const r = computeNationalMacroFinancialConditions(inputs, null, null);
    const pass = serviceCostPassThroughFromAffordability(inputs.householdAffordability);
    const spiral = assessWagePriceSpiral({
      inflationBand: r.state.inflation,
      householdAffordability: inputs.householdAffordability,
      fiscalPressure: inputs.fiscalPressure,
      wageGrowthPressureScore: 40 + t * 2,
      turn: t,
    });
    const exp = stepInflationExpectations({
      currentBand: r.state.inflation,
      priorAnchoringScore: anchoring,
      fiscalPressure: inputs.fiscalPressure,
      highInflationScenario: inputs.highInflationScenario,
      turn: t,
    });
    anchoring = exp.anchoringScore;
    const cpi = decomposeMacroCpiBasket(r.state.inflation, t, pass);
    const coreSpread = computeCoreHeadlineSpread(r.state.inflation, t, pass);
    regimeState = stepInflationRegimeTracker(regimeState, t, r.state.inflation, {
      creditStressed: r.state.credit === 'restricted' || r.state.credit === 'frozen',
      fiscalCritical: inputs.fiscalPressure === 'critical',
    });
    const regimeSnap = regimeState.history[regimeState.history.length - 1];
    const mom = stepInflationMomentum(momentumState, t, r.state.inflation);
    momentumState = mom.state;
    const importPass = assessImportPricePassThrough({
      tradeOpennessBand: 'mixed',
      exchangeRatePressure: inputs.highInflationScenario ? 'depreciation' : 'stable',
      commodityImportShare: 0.3,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const termPrem = assessTermPremiumInflationSignal({
      inflationBand: r.state.inflation,
      fiscalPressure: inputs.fiscalPressure,
      sovereignDebtPressure: inputs.sovereignDebtPressure,
      highInflationScenario: inputs.highInflationScenario,
    });
    const energyPass = assessEnergyPricePassThrough({
      wholesaleEnergyStress: inputs.highInflationScenario ? 'severe' : 'elevated',
      retailTariffShock: inputs.fiscalPressure === 'critical',
      gridReliabilityBand: inputs.systemicLiquidityBand === 'critical' ? 'fragile' : 'strained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const shelterRent = assessShelterRentInflation({
      vacancyBand:
        inputs.householdAffordability === 'severe_pressure'
          ? 'critical'
          : inputs.householdAffordability === 'strained'
            ? 'tight'
            : 'balanced',
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'strong' : 'moderate',
      urbanizationPressure: inputs.highInflationScenario ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const foodGrocery = assessFoodGroceryPassThrough({
      harvestStressBand: inputs.fiscalPressure === 'critical' ? 'severe' : inputs.highInflationScenario ? 'weak' : 'normal',
      retailMarginPressure: inputs.householdAffordability === 'severe_pressure' ? 'high' : 'medium',
      supplyChainDisruption: inputs.systemicLiquidityBand === 'critical' || inputs.creditShockActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const transportLog = assessTransportLogisticsInflation({
      freightCapacityBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.systemicLiquidityBand === 'strained'
            ? 'tight'
            : 'balanced',
      fuelSurchargeActive: inputs.highInflationScenario,
      portBacklogBand: inputs.fiscalPressure === 'critical' ? 'severe' : 'moderate',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const healthcare = assessHealthcareServicesInflation({
      wagePressureBand:
        inputs.fiscalPressure === 'critical' || inputs.highInflationScenario ? 'high' : 'moderate',
      demandSurgeActive: inputs.creditShockActive || inputs.activeCrises > 0,
      workforceShortageBand: inputs.householdAffordability === 'severe_pressure' ? 'severe' : 'moderate',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const insurancePrem = assessInsurancePremiumPassThrough({
      claimsInflationBand: inputs.highInflationScenario ? 'high' : 'moderate',
      reinsuranceStress: inputs.fiscalPressure === 'critical',
      catastropheLoadActive: inputs.activeCrises > 1,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const educationTuition = assessEducationTuitionInflation({
      enrollmentPressureBand: inputs.highInflationScenario ? 'high' : 'moderate',
      subsidyCutActive: inputs.fiscalPressure === 'critical' || inputs.fiscalPressure === 'strained',
      wageIndexationBand: inputs.householdInflationScenarioActive ? 'strong' : 'normal',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commsServices = assessCommunicationsServicesInflation({
      bandwidthDemandBand: inputs.creditShockActive ? 'surge' : 'normal',
      regulatedTariffShock: inputs.systemicLiquidityBand === 'critical',
      platformFeePassThrough: inputs.highInflationScenario ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const recreation = assessRecreationLeisureInflation({
      tourismDemandBand: inputs.highInflationScenario ? 'surge' : 'normal',
      laborCostPassThrough: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      discretionarySpendPressure: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const professionalFees = assessProfessionalServicesFeeInflation({
      billingRatePressure: inputs.highInflationScenario ? 'elevated' : 'normal',
      complianceCostStack: inputs.fiscalPressure === 'critical' || inputs.creditShockActive,
      corporateDemandBand: inputs.capitalPressure === 'high' || inputs.capitalPressure === 'critical' ? 'strong' : 'steady',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const childcare = assessChildcareServicesInflation({
      capacityShortageBand: inputs.householdAffordability === 'severe_pressure' ? 'severe' : 'moderate',
      wageAwardPassThrough: inputs.highInflationScenario ? 'strong' : 'normal',
      subsidyIndexationLag: inputs.fiscalPressure === 'critical' || inputs.fiscalPressure === 'strained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const govCharges = assessGovernmentChargesInflation({
      feeIndexationBand: inputs.highInflationScenario ? 'above_cpi' : 'at_cpi',
      newLevyStackActive: inputs.fiscalPressure === 'critical',
      localGovernmentPressure: inputs.publicStability < 45 ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const waterUtils = assessWaterUtilitiesInflation({
      droughtStressBand: inputs.systemicLiquidityBand === 'critical' ? 'severe' : 'moderate',
      infrastructureTariffShock: inputs.fiscalPressure === 'critical',
      recyclingCostPassThrough: inputs.creditShockActive ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const domesticTravel = assessDomesticTravelInflation({
      routeCapacityBand: inputs.highInflationScenario ? 'constrained' : 'balanced',
      fuelSurchargePassThrough: inputs.highInflationScenario,
      accommodationOccupancyBand: inputs.householdInflationScenarioActive ? 'full' : 'normal',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const constructionMaterials = assessConstructionMaterialsInflation({
      supplyChainStressBand: inputs.creditShockActive ? 'severe' : inputs.systemicLiquidityBand === 'strained' ? 'elevated' : 'normal',
      laborShortagePassThrough: inputs.fiscalPressure === 'critical',
      importContentShare: 0.25,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const retailMargin = assessRetailTradeMarginInflation({
      discountingIntensity: inputs.householdAffordability === 'severe_pressure' ? 'light' : 'moderate',
      inventoryClearanceActive: inputs.publicStability > 55,
      wageBillPressure: inputs.highInflationScenario ? 'high' : 'medium',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const financialFees = assessFinancialServicesFeeInflation({
      fundingCostPassThrough: inputs.creditShockActive ? 'high' : inputs.fiscalPressure === 'critical' ? 'medium' : 'low',
      complianceCostStackActive: inputs.fiscalPressure === 'critical' || inputs.activeCrises > 0,
      depositRateCompetitionBand: inputs.highInflationScenario ? 'intense' : 'normal',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const farmgate = assessAgriculturalFarmgateInflation({
      harvestStressBand: inputs.systemicLiquidityBand === 'critical' ? 'severe' : inputs.highInflationScenario ? 'weak' : 'normal',
      transportToMarketBand: inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical' ? 'strained' : 'smooth',
      inputCostPassThrough: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const publicGrid = assessPublicUtilitiesGridTariffInflation({
      serviceReliabilityBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.systemicLiquidityBand === 'strained'
            ? 'fragile'
            : 'strained',
      outageRiskBand: inputs.creditShockActive ? 'rolling' : inputs.fiscalPressure === 'critical' ? 'moderate' : 'clear',
      capacityMarginBand:
        inputs.systemicLiquidityBand === 'critical' || inputs.systemicLiquidityBand === 'strained' ? 'thin' : 'balanced',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiSalience = assessUiInflationSaliencePassThrough({
      dashboardStressHighlight: inputs.householdInflationScenarioActive,
      playerAttentionBand:
        inputs.householdAffordability === 'severe_pressure'
          ? 'high'
          : inputs.householdAffordability === 'strained'
            ? 'medium'
            : 'low',
      uiExpectationsNudgeUp: inputs.highInflationScenario,
      phaseShellCoachActive: inputs.householdInflationScenarioActive && inputs.publicStability < 50,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const housingEssential = assessHousingMortgageEssentialInflation({
      mortgageStressBand:
        inputs.householdAffordability === 'severe_pressure'
          ? 'severe'
          : inputs.householdAffordability === 'strained'
            ? 'elevated'
            : 'low',
      wellbeingCostBand:
        inputs.householdInflationScenarioActive && inputs.publicStability < 45
          ? 'critical'
          : inputs.householdInflationScenarioActive
            ? 'strained'
            : 'stable',
      essentialServicesInflationFlag: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const macroMerge = assessMacroTransmissionMergeInflation({
      transmissionStabilityFragile:
        inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical',
      macroRecoveryRankStressActive: inputs.creditShockActive || inputs.fiscalPressure === 'critical',
      outputGap: inputs.highInflationScenario ? 0.28 : -0.04,
      nominalDemandPressure: finClamp((inputs.inflationSettingMultiplier ?? 1) - 1, -0.2, 0.6),
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventsSpillover = assessDynamicEventsInflationSpillover({
      inflationShockEventActive: inputs.highInflationScenario,
      supplyDisruptionSeverity: inputs.creditShockActive ? 'national' : inputs.fiscalPressure === 'critical' ? 'localized' : 'none',
      confidenceShockBand: inputs.publicStability < 42 ? 'severe' : inputs.publicStability < 52 ? 'uneasy' : 'calm',
      stagedEventCostShockBand: inputs.creditShockActive ? 'cascade' : inputs.highInflationScenario ? 'active' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const dashboardOverlay = assessDashboardMapInflationOverlay({
      regionalHeatmapInflationAlert: inputs.householdInflationScenarioActive,
      mapLayerCostPressureScore: inputs.householdAffordability === 'severe_pressure' ? 0.72 : 0.38,
      dashboardRefreshUrgency:
        inputs.publicStability < 40 ? 'critical' : inputs.highInflationScenario ? 'elevated' : 'routine',
      dashboardInflationHeatmapSevere: inputs.householdInflationScenarioActive && inputs.publicStability < 48,
      mapLayerCostOfLivingStressActive: inputs.householdAffordability === 'severe_pressure',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const publicFinanceDebt = assessPublicFinanceDebtServiceInflation({
      consolidatedDeficitBand:
        inputs.fiscalPressure === 'critical' ? 'large_deficit' : inputs.fiscalPressure === 'strained' ? 'moderate_deficit' : 'balanced',
      debtServicePressure:
        inputs.sovereignDebtPressure === 'critical'
          ? 'critical'
          : inputs.sovereignDebtPressure === 'elevated'
            ? 'elevated'
            : 'moderate',
      fiscalAnchorBreached: inputs.fiscalPressure === 'critical' || inputs.fiscalSustainability === 'vulnerable',
      indexedChargesInflationPassThrough: inputs.fiscalPressure !== 'healthy',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const populationLabor = assessPopulationLaborWageInflation({
      laborParticipationBand: inputs.actorCreditStressIndex > 0.55 ? 'weak' : 'steady',
      wageGrowthBand:
        inputs.highInflationScenario && inputs.householdInflationScenarioActive
          ? 'surge'
          : inputs.householdInflationScenarioActive
            ? 'elevated'
            : 'moderate',
      costOfLivingStress:
        inputs.householdAffordability === 'severe_pressure'
          ? 'extreme'
          : inputs.householdAffordability === 'strained'
            ? 'high'
            : 'moderate',
      participationSlackInflationBand:
        inputs.householdAffordability === 'severe_pressure' ? 'severe_slack' : inputs.householdInflationScenarioActive ? 'slack' : 'balanced',
      householdExpectationsDeanchoring: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const wholesaleEnergy = assessWholesaleEnergyTransitionInflation({
      wholesaleEnergyStress:
        inputs.systemicLiquidityBand === 'critical' ? 'crisis' : inputs.highInflationScenario ? 'severe' : 'elevated',
      retailTariffShock: inputs.highInflationScenario,
      gridReliabilityBand:
        inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical' ? 'fragile' : 'strained',
      emissionsTransitionCostBand: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      renewableShortfallInflationFlag: inputs.creditShockActive,
      wholesaleCascadeBand: inputs.creditShockActive ? 'cascade' : inputs.fiscalPressure === 'critical' ? 'stressed' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const urbanRent = assessUrbanRentDispersionInflation({
      vacancyBand: inputs.householdAffordability === 'severe_pressure' ? 'critical' : 'tight',
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'surging' : 'strong',
      urbanizationPressure: inputs.publicStability < 50 ? 'high' : 'medium',
      regionalDispersionScore: inputs.householdAffordability === 'severe_pressure' ? 0.7 : 0.45,
      metroRentDispersionCritical: inputs.householdAffordability === 'severe_pressure',
      regionalHousingInflationSync: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const corporatePricing = assessCorporatePricingPassThroughInflation({
      pricingPowerBand: inputs.highInflationScenario ? 'strong' : 'moderate',
      marginCompression: inputs.actorCreditStressIndex > 0.55 ? 'severe' : 'mild',
      passThroughIntent: inputs.fiscalPressure === 'critical' ? 'full' : 'partial',
      productionCapacityStrainInflationFlag: inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical',
      corporateMarkupCascadeBand: inputs.creditShockActive ? 'active' : inputs.highInflationScenario ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tradeImport = assessTradeExchangeImportInflation({
      tradeOpennessBand: 'open',
      exchangeRatePressure: inputs.highInflationScenario ? 'sharp_depreciation' : 'stable',
      commodityImportShare: 0.38,
      tariffShockInflationActive: inputs.creditShockActive,
      importPipelineFragileBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'strained' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    maxCost = Math.max(maxCost, r.state.modifiers.costOfLivingMultiplier);
    points.push({
      turn: t,
      inflationBand: r.state.inflation,
      costMultiplier: r.state.modifiers.costOfLivingMultiplier,
      anchoringScore: anchoring,
      spiralRisk: spiral.spiralRisk,
      headlineCpiIndex: cpi.headlineIndex,
      coreCpiIndex: coreSpread.coreIndex,
      regime: regimeSnap?.regime ?? 'anchored_soft',
      momentumScore: mom.snapshot.momentumScore,
      momentumDirection: mom.snapshot.direction,
      importPassThroughBand: importPass.passThroughBand,
      termPremiumSignalBand: termPrem.signalBand,
      energyPassThroughBand: energyPass.passThroughBand,
      shelterRentPressureBand: shelterRent.pressureBand,
      foodGroceryPassThroughBand: foodGrocery.passThroughBand,
      transportLogisticsPressureBand: transportLog.pressureBand,
      healthcareServicesPressureBand: healthcare.pressureBand,
      insurancePremiumPassThroughBand: insurancePrem.passThroughBand,
      educationTuitionPressureBand: educationTuition.pressureBand,
      communicationsServicesPressureBand: commsServices.pressureBand,
      recreationLeisurePressureBand: recreation.pressureBand,
      professionalServicesFeeBand: professionalFees.feeBand,
      childcareServicesPressureBand: childcare.pressureBand,
      governmentChargesPressureBand: govCharges.pressureBand,
      waterUtilitiesPressureBand: waterUtils.pressureBand,
      domesticTravelPressureBand: domesticTravel.pressureBand,
      constructionMaterialsPressureBand: constructionMaterials.pressureBand,
      retailTradeMarginBand: retailMargin.marginBand,
      financialServicesFeeBand: financialFees.feeBand,
      agriculturalFarmgatePressureBand: farmgate.pressureBand,
      publicUtilitiesGridTariffBand: publicGrid.tariffBand,
      uiInflationSalienceBand: uiSalience.salienceBand,
      housingMortgageEssentialBand: housingEssential.essentialBand,
      macroTransmissionMergeBand: macroMerge.mergeBand,
      dynamicEventsInflationSpilloverBand: eventsSpillover.spilloverBand,
      dashboardMapInflationOverlayBand: dashboardOverlay.overlayBand,
      publicFinanceDebtServiceBand: publicFinanceDebt.debtServiceBand,
      populationLaborWageBand: populationLabor.wageBand,
      wholesaleEnergyTransitionBand: wholesaleEnergy.transitionBand,
      urbanRentDispersionBand: urbanRent.dispersionBand,
      corporatePricingPassThroughBand: corporatePricing.passThroughBand,
      tradeExchangeImportBand: tradeImport.importBand,
    });
  }

  return {
    points,
    terminalBand: points[points.length - 1]?.inflationBand ?? 'anchored',
    maxCostMultiplier: maxCost,
  };
}
