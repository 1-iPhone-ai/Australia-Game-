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
import type { CorporateMarkupInflationCascadeBand } from '../inflation/corporate-markup-inflation-cascade.js';
import type { TradeTariffImportInflationPipelineBand } from '../inflation/trade-tariff-import-inflation-pipeline.js';
import type { MetroUrbanRentInflationSurgeBand } from '../inflation/metro-urban-rent-inflation-surge.js';
import type { WholesaleGridEnergyInflationCascadeBand } from '../inflation/wholesale-grid-energy-inflation-cascade.js';
import type { GuardianGuardrailInflationEscalationBand } from '../inflation/guardian-guardrail-inflation-escalation.js';
import type { TeamConsensusInflationBriefingDriftBand } from '../inflation/team-consensus-inflation-briefing-drift.js';
import type { MemoryCommonwealthInflationRecallGateBand } from '../inflation/memory-commonwealth-inflation-recall-gate.js';
import type { AutomationSynthesisInflationCascadeDriftBand } from '../inflation/automation-synthesis-inflation-cascade-drift.js';
import type { UiShellInflationSalienceEscalationBand } from '../inflation/ui-shell-inflation-salience-escalation.js';
import type { DashboardHeatmapInflationOverlayCascadeBand } from '../inflation/dashboard-heatmap-inflation-overlay-cascade.js';
import type { CommandCenterInflationFusionLatchBand } from '../inflation/command-center-inflation-fusion-latch.js';
import type { TransportFreightInflationCongestionCascadeBand } from '../inflation/transport-freight-inflation-congestion-cascade.js';
import type { EventsStagedInflationShockPersistenceBand } from '../inflation/events-staged-inflation-shock-persistence.js';
import type { ModesSandboxInflationStressCascadeBand } from '../inflation/modes-sandbox-inflation-stress-cascade.js';
import type { FiscalAppropriationInflationPressureLatchBand } from '../inflation/fiscal-appropriation-inflation-pressure-latch.js';
import type { HouseholdBudgetInflationStressCascadeBand } from '../inflation/household-budget-inflation-stress-cascade.js';
import type { CorporateSurvivalPricingInflationLatchBand } from '../inflation/corporate-survival-pricing-inflation-latch.js';
import type { TradeTariffExchangeInflationEscalationBand } from '../inflation/trade-tariff-exchange-inflation-escalation.js';
import type { MetroCapacityRentInflationLatchBand } from '../inflation/metro-capacity-rent-inflation-latch.js';
import type { GridWholesaleTariffInflationSurgeBand } from '../inflation/grid-wholesale-tariff-inflation-surge.js';
import type { GuardianCopilotInflationPressureLatchBand } from '../inflation/guardian-copilot-inflation-pressure-latch.js';
import type { TeamBriefingConsensusInflationUnmooringBand } from '../inflation/team-briefing-consensus-inflation-unmooring.js';
import type { MemoryRealmInflationPersistenceLatchBand } from '../inflation/memory-realm-inflation-persistence-latch.js';
import type { AutomationSynthesisInflationCascadeSurgeBand } from '../inflation/automation-synthesis-inflation-cascade-surge.js';
import type { UiShellInflationAttentionLatchBand } from '../inflation/ui-shell-inflation-attention-latch.js';
import type { DashboardRegionalInflationOverlaySurgeBand } from '../inflation/dashboard-regional-inflation-overlay-surge.js';
import type { CommandCenterInflationAlertPressureLatchBand } from '../inflation/command-center-inflation-alert-pressure-latch.js';
import type { TransportFreightInflationGridlockSurgeBand } from '../inflation/transport-freight-inflation-gridlock-surge.js';
import type { EventsNarrativeInflationShockLatchBand } from '../inflation/events-narrative-inflation-shock-latch.js';
import type { ModesSandboxInflationPressureSurgeBand } from '../inflation/modes-sandbox-inflation-pressure-surge.js';
import type { FiscalConsolidatedInflationPressureLatchBand } from '../inflation/fiscal-consolidated-inflation-pressure-latch.js';
import type { HouseholdWageInflationStressSurgeBand } from '../inflation/household-wage-inflation-stress-surge.js';
import type { MacroOutputGapInflationPressureLatchBand } from '../inflation/macro-output-gap-inflation-pressure-latch.js';
import type { CorporateCapacityMarkupInflationSurgeBand } from '../inflation/corporate-capacity-markup-inflation-surge.js';
import type { ResearchBreakthroughSupplySideInflationLatchBand } from '../inflation/research-breakthrough-supply-side-inflation-latch.js';
import type { TradeImportExchangeInflationPipelineSurgeBand } from '../inflation/trade-import-exchange-inflation-pipeline-surge.js';
import type { MetroRegionalRentInflationEscalationLatchBand } from '../inflation/metro-regional-rent-inflation-escalation-latch.js';
import type { WholesaleGridTransitionInflationSurgeBand } from '../inflation/wholesale-grid-transition-inflation-surge.js';
import { finRound } from '../compute/math.js';

/** Contract surface for Agent 21 forecasting fusion (read-only bundle). */
export interface Agent21InflationForecastBundle {
  schemaVersion: '10.14.agent10.r49';
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
  terminalCorporateMarkupInflationCascade: CorporateMarkupInflationCascadeBand;
  terminalTradeTariffImportInflationPipeline: TradeTariffImportInflationPipelineBand;
  terminalMetroUrbanRentInflationSurge: MetroUrbanRentInflationSurgeBand;
  terminalWholesaleGridEnergyInflationCascade: WholesaleGridEnergyInflationCascadeBand;
  terminalGuardianGuardrailInflationEscalation: GuardianGuardrailInflationEscalationBand;
  terminalTeamConsensusInflationBriefingDrift: TeamConsensusInflationBriefingDriftBand;
  terminalMemoryCommonwealthInflationRecallGate: MemoryCommonwealthInflationRecallGateBand;
  terminalAutomationSynthesisInflationCascadeDrift: AutomationSynthesisInflationCascadeDriftBand;
  terminalUiShellInflationSalienceEscalation: UiShellInflationSalienceEscalationBand;
  terminalDashboardHeatmapInflationOverlayCascade: DashboardHeatmapInflationOverlayCascadeBand;
  terminalCommandCenterInflationFusionLatch: CommandCenterInflationFusionLatchBand;
  terminalTransportFreightInflationCongestionCascade: TransportFreightInflationCongestionCascadeBand;
  terminalEventsStagedInflationShockPersistence: EventsStagedInflationShockPersistenceBand;
  terminalModesSandboxInflationStressCascade: ModesSandboxInflationStressCascadeBand;
  terminalFiscalAppropriationInflationPressureLatch: FiscalAppropriationInflationPressureLatchBand;
  terminalHouseholdBudgetInflationStressCascade: HouseholdBudgetInflationStressCascadeBand;
  terminalCorporateSurvivalPricingInflationLatch: CorporateSurvivalPricingInflationLatchBand;
  terminalTradeTariffExchangeInflationEscalation: TradeTariffExchangeInflationEscalationBand;
  terminalMetroCapacityRentInflationLatch: MetroCapacityRentInflationLatchBand;
  terminalGridWholesaleTariffInflationSurge: GridWholesaleTariffInflationSurgeBand;
  terminalGuardianCopilotInflationPressureLatch: GuardianCopilotInflationPressureLatchBand;
  terminalTeamBriefingConsensusInflationUnmooring: TeamBriefingConsensusInflationUnmooringBand;
  terminalMemoryRealmInflationPersistenceLatch: MemoryRealmInflationPersistenceLatchBand;
  terminalAutomationSynthesisInflationCascadeSurge: AutomationSynthesisInflationCascadeSurgeBand;
  terminalUiShellInflationAttentionLatch: UiShellInflationAttentionLatchBand;
  terminalDashboardRegionalInflationOverlaySurge: DashboardRegionalInflationOverlaySurgeBand;
  terminalCommandCenterInflationAlertPressureLatch: CommandCenterInflationAlertPressureLatchBand;
  terminalTransportFreightInflationGridlockSurge: TransportFreightInflationGridlockSurgeBand;
  terminalEventsNarrativeInflationShockLatch: EventsNarrativeInflationShockLatchBand;
  terminalModesSandboxInflationPressureSurge: ModesSandboxInflationPressureSurgeBand;
  terminalFiscalConsolidatedInflationPressureLatch: FiscalConsolidatedInflationPressureLatchBand;
  terminalHouseholdWageInflationStressSurge: HouseholdWageInflationStressSurgeBand;
  terminalMacroOutputGapInflationPressureLatch: MacroOutputGapInflationPressureLatchBand;
  terminalCorporateCapacityMarkupInflationSurge: CorporateCapacityMarkupInflationSurgeBand;
  terminalResearchBreakthroughSupplySideInflationLatch: ResearchBreakthroughSupplySideInflationLatchBand;
  terminalTradeImportExchangeInflationPipelineSurge: TradeImportExchangeInflationPipelineSurgeBand;
  terminalMetroRegionalRentInflationEscalationLatch: MetroRegionalRentInflationEscalationLatchBand;
  terminalWholesaleGridTransitionInflationSurge: WholesaleGridTransitionInflationSurgeBand;
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
    schemaVersion: '10.14.agent10.r49',
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
    terminalCorporateMarkupInflationCascade: lastPoint?.corporateMarkupInflationCascadeBand ?? 'absorbed',
    terminalTradeTariffImportInflationPipeline: lastPoint?.tradeTariffImportInflationPipelineBand ?? 'anchored',
    terminalMetroUrbanRentInflationSurge: lastPoint?.metroUrbanRentInflationSurgeBand ?? 'subdued',
    terminalWholesaleGridEnergyInflationCascade: lastPoint?.wholesaleGridEnergyInflationCascadeBand ?? 'stable',
    terminalGuardianGuardrailInflationEscalation: lastPoint?.guardianGuardrailInflationEscalationBand ?? 'calm',
    terminalTeamConsensusInflationBriefingDrift: lastPoint?.teamConsensusInflationBriefingDriftBand ?? 'anchored',
    terminalMemoryCommonwealthInflationRecallGate: lastPoint?.memoryCommonwealthInflationRecallGateBand ?? 'anchored',
    terminalAutomationSynthesisInflationCascadeDrift: lastPoint?.automationSynthesisInflationCascadeDriftBand ?? 'neutral',
    terminalUiShellInflationSalienceEscalation: lastPoint?.uiShellInflationSalienceEscalationBand ?? 'muted',
    terminalDashboardHeatmapInflationOverlayCascade: lastPoint?.dashboardHeatmapInflationOverlayCascadeBand ?? 'routine',
    terminalCommandCenterInflationFusionLatch: lastPoint?.commandCenterInflationFusionLatchBand ?? 'stable',
    terminalTransportFreightInflationCongestionCascade:
      lastPoint?.transportFreightInflationCongestionCascadeBand ?? 'clear',
    terminalEventsStagedInflationShockPersistence: lastPoint?.eventsStagedInflationShockPersistenceBand ?? 'muted',
    terminalModesSandboxInflationStressCascade: lastPoint?.modesSandboxInflationStressCascadeBand ?? 'routine',
    terminalFiscalAppropriationInflationPressureLatch:
      lastPoint?.fiscalAppropriationInflationPressureLatchBand ?? 'stable',
    terminalHouseholdBudgetInflationStressCascade: lastPoint?.householdBudgetInflationStressCascadeBand ?? 'contained',
    terminalCorporateSurvivalPricingInflationLatch: lastPoint?.corporateSurvivalPricingInflationLatchBand ?? 'contained',
    terminalTradeTariffExchangeInflationEscalation: lastPoint?.tradeTariffExchangeInflationEscalationBand ?? 'stable',
    terminalMetroCapacityRentInflationLatch: lastPoint?.metroCapacityRentInflationLatchBand ?? 'subdued',
    terminalGridWholesaleTariffInflationSurge: lastPoint?.gridWholesaleTariffInflationSurgeBand ?? 'stable',
    terminalGuardianCopilotInflationPressureLatch: lastPoint?.guardianCopilotInflationPressureLatchBand ?? 'subdued',
    terminalTeamBriefingConsensusInflationUnmooring: lastPoint?.teamBriefingConsensusInflationUnmooringBand ?? 'stable',
    terminalMemoryRealmInflationPersistenceLatch: lastPoint?.memoryRealmInflationPersistenceLatchBand ?? 'subdued',
    terminalAutomationSynthesisInflationCascadeSurge: lastPoint?.automationSynthesisInflationCascadeSurgeBand ?? 'stable',
    terminalUiShellInflationAttentionLatch: lastPoint?.uiShellInflationAttentionLatchBand ?? 'muted',
    terminalDashboardRegionalInflationOverlaySurge: lastPoint?.dashboardRegionalInflationOverlaySurgeBand ?? 'routine',
    terminalCommandCenterInflationAlertPressureLatch: lastPoint?.commandCenterInflationAlertPressureLatchBand ?? 'subdued',
    terminalTransportFreightInflationGridlockSurge: lastPoint?.transportFreightInflationGridlockSurgeBand ?? 'clear',
    terminalEventsNarrativeInflationShockLatch: lastPoint?.eventsNarrativeInflationShockLatchBand ?? 'muted',
    terminalModesSandboxInflationPressureSurge: lastPoint?.modesSandboxInflationPressureSurgeBand ?? 'routine',
    terminalFiscalConsolidatedInflationPressureLatch: lastPoint?.fiscalConsolidatedInflationPressureLatchBand ?? 'subdued',
    terminalHouseholdWageInflationStressSurge: lastPoint?.householdWageInflationStressSurgeBand ?? 'contained',
    terminalMacroOutputGapInflationPressureLatch: lastPoint?.macroOutputGapInflationPressureLatchBand ?? 'subdued',
    terminalCorporateCapacityMarkupInflationSurge: lastPoint?.corporateCapacityMarkupInflationSurgeBand ?? 'contained',
    terminalResearchBreakthroughSupplySideInflationLatch:
      lastPoint?.researchBreakthroughSupplySideInflationLatchBand ?? 'neutral',
    terminalTradeImportExchangeInflationPipelineSurge:
      lastPoint?.tradeImportExchangeInflationPipelineSurgeBand ?? 'anchored',
    terminalMetroRegionalRentInflationEscalationLatch:
      lastPoint?.metroRegionalRentInflationEscalationLatchBand ?? 'subdued',
    terminalWholesaleGridTransitionInflationSurge:
      lastPoint?.wholesaleGridTransitionInflationSurgeBand ?? 'stable',
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
