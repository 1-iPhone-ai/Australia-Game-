import type { InflationForecastPath } from './inflation-forecast.js';
import type { InflationRegimeSnapshot } from './inflation-regime-tracker.js';
import type { InflationShockClassification } from '../inflation/supply-demand-shock.js';
import type { FiscalDominanceAssessment } from '../fiscal/fiscal-dominance.js';
import type { InflationTargetBreach } from '../rates/inflation-target-breach.js';
import type { InflationMomentumSnapshot } from '../inflation/inflation-momentum.js';
import type { RealRateGapAssessment } from '../rates/real-rate-gap.js';
import type { CreditInflationFeedbackAssessment } from '../credit/credit-inflation-feedback.js';
import type { ImportPassThroughBand } from '../inflation/import-price-pass-through.js';
import type { TermPremiumSignalBand } from '../rates/term-premium-inflation-signal.js';
import type { EnergyPassThroughBand } from '../inflation/energy-price-pass-through.js';
import type { ShelterRentPressureBand } from '../inflation/shelter-rent-inflation.js';
import type { FoodGroceryPassThroughBand } from '../inflation/food-grocery-pass-through.js';
import type { TransportLogisticsPressureBand } from '../inflation/transport-logistics-inflation.js';
import type { HealthcareServicesPressureBand } from '../inflation/healthcare-services-inflation.js';
import type { InsurancePremiumPassThroughBand } from '../inflation/insurance-premium-pass-through.js';
import type { EducationTuitionPressureBand } from '../inflation/education-tuition-inflation.js';
import type { CommunicationsServicesPressureBand } from '../inflation/communications-services-inflation.js';
import type { RecreationLeisurePressureBand } from '../inflation/recreation-leisure-inflation.js';
import type { ProfessionalServicesFeeBand } from '../inflation/professional-services-fee-inflation.js';
import type { ChildcareServicesPressureBand } from '../inflation/childcare-services-inflation.js';
import type { GovernmentChargesPressureBand } from '../inflation/government-charges-inflation.js';
import type { WaterUtilitiesPressureBand } from '../inflation/water-utilities-inflation.js';
import type { DomesticTravelPressureBand } from '../inflation/domestic-travel-inflation.js';
import type { ConstructionMaterialsPressureBand } from '../inflation/construction-materials-inflation.js';
import type { RetailTradeMarginBand } from '../inflation/retail-trade-margin-inflation.js';
import type { FinancialServicesFeeBand } from '../inflation/financial-services-fee-inflation.js';
import type { AgriculturalFarmgatePressureBand } from '../inflation/agricultural-farmgate-inflation.js';
import type { PublicUtilitiesGridTariffBand } from '../inflation/public-utilities-grid-tariff-inflation.js';
import type { UiInflationSalienceBand } from '../inflation/ui-inflation-salience-pass-through.js';
import type { HousingMortgageEssentialBand } from '../inflation/housing-mortgage-essential-inflation.js';
import type { MacroTransmissionMergeBand } from '../inflation/macro-transmission-merge-inflation.js';
import type { DynamicEventsInflationSpilloverBand } from '../inflation/dynamic-events-inflation-spillover.js';
import type { DashboardMapInflationOverlayBand } from '../inflation/dashboard-map-inflation-overlay.js';
import type { PublicFinanceDebtServiceBand } from '../inflation/public-finance-debt-service-inflation.js';
import type { PopulationLaborWageBand } from '../inflation/population-labor-wage-inflation.js';
import type { WholesaleEnergyTransitionBand } from '../inflation/wholesale-energy-transition-inflation.js';
import type { UrbanRentDispersionBand } from '../inflation/urban-rent-dispersion-inflation.js';
import type { CorporatePricingPassThroughBand } from '../inflation/corporate-pricing-pass-through-inflation.js';
import type { TradeExchangeImportBand } from '../inflation/trade-exchange-import-inflation.js';
import type { GuardianInflationInterventionBand } from '../inflation/guardian-inflation-intervention-inflation.js';
import type { TeamIntelligenceConsensusBand } from '../inflation/team-intelligence-consensus-inflation.js';
import type { StrategicGeopoliticalPremiumBand } from '../inflation/strategic-geopolitical-inflation-premium.js';
import type { AiMemoryInflationRecallBand } from '../inflation/ai-memory-inflation-recall-inflation.js';
import type { CalendarSeasonInflationCarryoverBand } from '../inflation/calendar-season-inflation-carryover.js';
import type { AutomationAutopilotInflationDriftBand } from '../inflation/automation-autopilot-inflation-drift.js';
import type { ResearchProductivityInflationOffsetBand } from '../inflation/research-productivity-inflation-offset.js';
import type { ScenarioSandboxInflationBiasBand } from '../inflation/scenario-sandbox-inflation-bias.js';
import type { EventsNarrativeInflationPersistenceBand } from '../inflation/events-narrative-inflation-persistence.js';
import type { MacroDemandOverheatInflationSlippageBand } from '../inflation/macro-demand-overheat-inflation-slippage.js';
import type { FreightLogisticsInflationCongestionBand } from '../inflation/freight-logistics-inflation-congestion.js';
import type { HousingWellbeingInflationEssentialStressBand } from '../inflation/housing-wellbeing-inflation-essential-stress.js';
import type { CommandCenterInflationFusionEscalationBand } from '../inflation/command-center-inflation-fusion-escalation.js';
import type { UiPlayerInflationSalienceNudgeBand } from '../inflation/ui-player-inflation-salience-nudge.js';
import type { FiscalIndexationInflationAnchorBreachBand } from '../inflation/fiscal-indexation-inflation-anchor-breach.js';
import type { HouseholdWageInflationDeanchoringBand } from '../inflation/household-wage-inflation-deanchoring.js';
import { finRound } from '../compute/math.js';

/** Contract surface for Agent 21 forecasting fusion (read-only bundle). */
export interface Agent21InflationForecastBundle {
  schemaVersion: '10.14.agent10.r30';
  horizonTurns: number;
  terminalBand: InflationForecastPath['terminalBand'];
  maxCostMultiplier: number;
  meanAnchoringScore: number;
  terminalMomentumDirection: InflationMomentumSnapshot['direction'];
  realRateGapBand: RealRateGapAssessment['gapBand'];
  creditInflationFeedback: CreditInflationFeedbackAssessment['feedbackLoop'];
  terminalImportPassThrough: ImportPassThroughBand;
  terminalTermPremiumSignal: TermPremiumSignalBand;
  terminalEnergyPassThrough: EnergyPassThroughBand;
  terminalShelterRentPressure: ShelterRentPressureBand;
  terminalFoodGroceryPassThrough: FoodGroceryPassThroughBand;
  terminalTransportLogisticsPressure: TransportLogisticsPressureBand;
  terminalHealthcareServicesPressure: HealthcareServicesPressureBand;
  terminalInsurancePremiumPassThrough: InsurancePremiumPassThroughBand;
  terminalEducationTuitionPressure: EducationTuitionPressureBand;
  terminalCommunicationsServicesPressure: CommunicationsServicesPressureBand;
  terminalRecreationLeisurePressure: RecreationLeisurePressureBand;
  terminalProfessionalServicesFee: ProfessionalServicesFeeBand;
  terminalChildcareServicesPressure: ChildcareServicesPressureBand;
  terminalGovernmentChargesPressure: GovernmentChargesPressureBand;
  terminalWaterUtilitiesPressure: WaterUtilitiesPressureBand;
  terminalDomesticTravelPressure: DomesticTravelPressureBand;
  terminalConstructionMaterialsPressure: ConstructionMaterialsPressureBand;
  terminalRetailTradeMargin: RetailTradeMarginBand;
  terminalFinancialServicesFee: FinancialServicesFeeBand;
  terminalAgriculturalFarmgatePressure: AgriculturalFarmgatePressureBand;
  terminalPublicUtilitiesGridTariff: PublicUtilitiesGridTariffBand;
  terminalUiInflationSalience: UiInflationSalienceBand;
  terminalHousingMortgageEssential: HousingMortgageEssentialBand;
  terminalMacroTransmissionMerge: MacroTransmissionMergeBand;
  terminalDynamicEventsInflationSpillover: DynamicEventsInflationSpilloverBand;
  terminalDashboardMapInflationOverlay: DashboardMapInflationOverlayBand;
  terminalPublicFinanceDebtService: PublicFinanceDebtServiceBand;
  terminalPopulationLaborWage: PopulationLaborWageBand;
  terminalWholesaleEnergyTransition: WholesaleEnergyTransitionBand;
  terminalUrbanRentDispersion: UrbanRentDispersionBand;
  terminalCorporatePricingPassThrough: CorporatePricingPassThroughBand;
  terminalTradeExchangeImport: TradeExchangeImportBand;
  terminalGuardianInflationIntervention: GuardianInflationInterventionBand;
  terminalTeamIntelligenceConsensus: TeamIntelligenceConsensusBand;
  terminalStrategicGeopoliticalPremium: StrategicGeopoliticalPremiumBand;
  terminalAiMemoryInflationRecall: AiMemoryInflationRecallBand;
  terminalCalendarSeasonInflationCarryover: CalendarSeasonInflationCarryoverBand;
  terminalAutomationAutopilotInflationDrift: AutomationAutopilotInflationDriftBand;
  terminalResearchProductivityInflationOffset: ResearchProductivityInflationOffsetBand;
  terminalScenarioSandboxInflationBias: ScenarioSandboxInflationBiasBand;
  terminalEventsNarrativeInflationPersistence: EventsNarrativeInflationPersistenceBand;
  terminalMacroDemandOverheatInflationSlippage: MacroDemandOverheatInflationSlippageBand;
  terminalFreightLogisticsInflationCongestion: FreightLogisticsInflationCongestionBand;
  terminalHousingWellbeingInflationEssentialStress: HousingWellbeingInflationEssentialStressBand;
  terminalCommandCenterInflationFusionEscalation: CommandCenterInflationFusionEscalationBand;
  terminalUiPlayerInflationSalienceNudge: UiPlayerInflationSalienceNudgeBand;
  terminalFiscalIndexationInflationAnchorBreach: FiscalIndexationInflationAnchorBreachBand;
  terminalHouseholdWageInflationDeanchoring: HouseholdWageInflationDeanchoringBand;
  regime: InflationRegimeSnapshot | null;
  shockDriver: InflationShockClassification['driver'];
  fiscalDominanceBand: FiscalDominanceAssessment['band'];
  targetBreachSeverity: InflationTargetBreach['breachSeverity'];
  integrationNote: string;
}

export function buildAgent21InflationForecastBundle(input: {
  path: InflationForecastPath;
  regime: InflationRegimeSnapshot | null;
  shock: InflationShockClassification;
  fiscalDominance: FiscalDominanceAssessment;
  targetBreach: InflationTargetBreach;
  momentum?: InflationMomentumSnapshot | null;
  realRateGap?: RealRateGapAssessment | null;
  creditFeedback?: CreditInflationFeedbackAssessment | null;
}): Agent21InflationForecastBundle {
  const meanAnchoring =
    input.path.points.length === 0
      ? 0
      : finRound(
          input.path.points.reduce((s, p) => s + p.anchoringScore, 0) / input.path.points.length,
          1,
        );

  const lastPoint = input.path.points[input.path.points.length - 1];

  return {
    schemaVersion: '10.14.agent10.r30',
    horizonTurns: input.path.points.length,
    terminalBand: input.path.terminalBand,
    maxCostMultiplier: input.path.maxCostMultiplier,
    meanAnchoringScore: meanAnchoring,
    terminalMomentumDirection: input.momentum?.direction ?? lastPoint?.momentumDirection ?? 'stable',
    realRateGapBand: input.realRateGap?.gapBand ?? 'neutral',
    creditInflationFeedback: input.creditFeedback?.feedbackLoop ?? 'neutral',
    terminalImportPassThrough: lastPoint?.importPassThroughBand ?? 'muted',
    terminalTermPremiumSignal: lastPoint?.termPremiumSignalBand ?? 'anchored',
    terminalEnergyPassThrough: lastPoint?.energyPassThroughBand ?? 'subdued',
    terminalShelterRentPressure: lastPoint?.shelterRentPressureBand ?? 'soft',
    terminalFoodGroceryPassThrough: lastPoint?.foodGroceryPassThroughBand ?? 'stable',
    terminalTransportLogisticsPressure: lastPoint?.transportLogisticsPressureBand ?? 'smooth',
    terminalHealthcareServicesPressure: lastPoint?.healthcareServicesPressureBand ?? 'contained',
    terminalInsurancePremiumPassThrough: lastPoint?.insurancePremiumPassThroughBand ?? 'stable',
    terminalEducationTuitionPressure: lastPoint?.educationTuitionPressureBand ?? 'stable',
    terminalCommunicationsServicesPressure: lastPoint?.communicationsServicesPressureBand ?? 'soft',
    terminalRecreationLeisurePressure: lastPoint?.recreationLeisurePressureBand ?? 'soft',
    terminalProfessionalServicesFee: lastPoint?.professionalServicesFeeBand ?? 'stable',
    terminalChildcareServicesPressure: lastPoint?.childcareServicesPressureBand ?? 'stable',
    terminalGovernmentChargesPressure: lastPoint?.governmentChargesPressureBand ?? 'flat',
    terminalWaterUtilitiesPressure: lastPoint?.waterUtilitiesPressureBand ?? 'stable',
    terminalDomesticTravelPressure: lastPoint?.domesticTravelPressureBand ?? 'subdued',
    terminalConstructionMaterialsPressure: lastPoint?.constructionMaterialsPressureBand ?? 'soft',
    terminalRetailTradeMargin: lastPoint?.retailTradeMarginBand ?? 'stable',
    terminalFinancialServicesFee: lastPoint?.financialServicesFeeBand ?? 'subdued',
    terminalAgriculturalFarmgatePressure: lastPoint?.agriculturalFarmgatePressureBand ?? 'soft',
    terminalPublicUtilitiesGridTariff: lastPoint?.publicUtilitiesGridTariffBand ?? 'subdued',
    terminalUiInflationSalience: lastPoint?.uiInflationSalienceBand ?? 'muted',
    terminalHousingMortgageEssential: lastPoint?.housingMortgageEssentialBand ?? 'subdued',
    terminalMacroTransmissionMerge: lastPoint?.macroTransmissionMergeBand ?? 'coherent',
    terminalDynamicEventsInflationSpillover: lastPoint?.dynamicEventsInflationSpilloverBand ?? 'muted',
    terminalDashboardMapInflationOverlay: lastPoint?.dashboardMapInflationOverlayBand ?? 'routine',
    terminalPublicFinanceDebtService: lastPoint?.publicFinanceDebtServiceBand ?? 'anchored',
    terminalPopulationLaborWage: lastPoint?.populationLaborWageBand ?? 'subdued',
    terminalWholesaleEnergyTransition: lastPoint?.wholesaleEnergyTransitionBand ?? 'stable',
    terminalUrbanRentDispersion: lastPoint?.urbanRentDispersionBand ?? 'aligned',
    terminalCorporatePricingPassThrough: lastPoint?.corporatePricingPassThroughBand ?? 'absorbed',
    terminalTradeExchangeImport: lastPoint?.tradeExchangeImportBand ?? 'anchored',
    terminalGuardianInflationIntervention: lastPoint?.guardianInflationInterventionBand ?? 'calm',
    terminalTeamIntelligenceConsensus: lastPoint?.teamIntelligenceConsensusBand ?? 'anchored',
    terminalStrategicGeopoliticalPremium: lastPoint?.strategicGeopoliticalPremiumBand ?? 'contained',
    terminalAiMemoryInflationRecall: lastPoint?.aiMemoryInflationRecallBand ?? 'anchored',
    terminalCalendarSeasonInflationCarryover: lastPoint?.calendarSeasonInflationCarryoverBand ?? 'off_season',
    terminalAutomationAutopilotInflationDrift: lastPoint?.automationAutopilotInflationDriftBand ?? 'neutral',
    terminalResearchProductivityInflationOffset: lastPoint?.researchProductivityInflationOffsetBand ?? 'neutral',
    terminalScenarioSandboxInflationBias: lastPoint?.scenarioSandboxInflationBiasBand ?? 'neutral',
    terminalEventsNarrativeInflationPersistence: lastPoint?.eventsNarrativeInflationPersistenceBand ?? 'muted',
    terminalMacroDemandOverheatInflationSlippage: lastPoint?.macroDemandOverheatInflationSlippageBand ?? 'anchored',
    terminalFreightLogisticsInflationCongestion: lastPoint?.freightLogisticsInflationCongestionBand ?? 'clear',
    terminalHousingWellbeingInflationEssentialStress: lastPoint?.housingWellbeingInflationEssentialStressBand ?? 'stable',
    terminalCommandCenterInflationFusionEscalation: lastPoint?.commandCenterInflationFusionEscalationBand ?? 'calm',
    terminalUiPlayerInflationSalienceNudge: lastPoint?.uiPlayerInflationSalienceNudgeBand ?? 'muted',
    terminalFiscalIndexationInflationAnchorBreach: lastPoint?.fiscalIndexationInflationAnchorBreachBand ?? 'anchored',
    terminalHouseholdWageInflationDeanchoring: lastPoint?.householdWageInflationDeanchoringBand ?? 'anchored',
    regime: input.regime,
    shockDriver: input.shock.driver,
    fiscalDominanceBand: input.fiscalDominance.band,
    targetBreachSeverity: input.targetBreach.breachSeverity,
    integrationNote: 'Agent 10 macro CPI bundle — commodity resourcePrices excluded.',
  };
}

export function agent21ForecastBridgeIntegrationNote(): string {
  return 'Agent 21 may consume Agent21InflationForecastBundle for inflation fusion; no RNG.';
}
