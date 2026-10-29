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
import {
  assessGuardianInflationInterventionInflation,
  type GuardianInflationInterventionBand,
} from '../inflation/guardian-inflation-intervention-inflation.js';
import {
  assessTeamIntelligenceConsensusInflation,
  type TeamIntelligenceConsensusBand,
} from '../inflation/team-intelligence-consensus-inflation.js';
import {
  assessStrategicGeopoliticalInflationPremium,
  type StrategicGeopoliticalPremiumBand,
} from '../inflation/strategic-geopolitical-inflation-premium.js';
import {
  assessAiMemoryInflationRecallInflation,
  type AiMemoryInflationRecallBand,
} from '../inflation/ai-memory-inflation-recall-inflation.js';
import {
  assessCalendarSeasonInflationCarryover,
  type CalendarSeasonInflationCarryoverBand,
} from '../inflation/calendar-season-inflation-carryover.js';
import {
  assessAutomationAutopilotInflationDrift,
  type AutomationAutopilotInflationDriftBand,
} from '../inflation/automation-autopilot-inflation-drift.js';
import {
  assessResearchProductivityInflationOffset,
  type ResearchProductivityInflationOffsetBand,
} from '../inflation/research-productivity-inflation-offset.js';
import {
  assessScenarioSandboxInflationBias,
  type ScenarioSandboxInflationBiasBand,
} from '../inflation/scenario-sandbox-inflation-bias.js';
import {
  assessEventsNarrativeInflationPersistence,
  type EventsNarrativeInflationPersistenceBand,
} from '../inflation/events-narrative-inflation-persistence.js';
import {
  assessMacroDemandOverheatInflationSlippage,
  type MacroDemandOverheatInflationSlippageBand,
} from '../inflation/macro-demand-overheat-inflation-slippage.js';
import {
  assessFreightLogisticsInflationCongestion,
  type FreightLogisticsInflationCongestionBand,
} from '../inflation/freight-logistics-inflation-congestion.js';
import {
  assessHousingWellbeingInflationEssentialStress,
  type HousingWellbeingInflationEssentialStressBand,
} from '../inflation/housing-wellbeing-inflation-essential-stress.js';
import {
  assessCommandCenterInflationFusionEscalation,
  type CommandCenterInflationFusionEscalationBand,
} from '../inflation/command-center-inflation-fusion-escalation.js';
import {
  assessUiPlayerInflationSalienceNudge,
  type UiPlayerInflationSalienceNudgeBand,
} from '../inflation/ui-player-inflation-salience-nudge.js';
import {
  assessFiscalIndexationInflationAnchorBreach,
  type FiscalIndexationInflationAnchorBreachBand,
} from '../inflation/fiscal-indexation-inflation-anchor-breach.js';
import {
  assessHouseholdWageInflationDeanchoring,
  type HouseholdWageInflationDeanchoringBand,
} from '../inflation/household-wage-inflation-deanchoring.js';
import {
  assessCorporateMarkupInflationCascade,
  type CorporateMarkupInflationCascadeBand,
} from '../inflation/corporate-markup-inflation-cascade.js';
import {
  assessTradeTariffImportInflationPipeline,
  type TradeTariffImportInflationPipelineBand,
} from '../inflation/trade-tariff-import-inflation-pipeline.js';
import {
  assessMetroUrbanRentInflationSurge,
  type MetroUrbanRentInflationSurgeBand,
} from '../inflation/metro-urban-rent-inflation-surge.js';
import {
  assessWholesaleGridEnergyInflationCascade,
  type WholesaleGridEnergyInflationCascadeBand,
} from '../inflation/wholesale-grid-energy-inflation-cascade.js';
import {
  assessGuardianGuardrailInflationEscalation,
  type GuardianGuardrailInflationEscalationBand,
} from '../inflation/guardian-guardrail-inflation-escalation.js';
import {
  assessTeamConsensusInflationBriefingDrift,
  type TeamConsensusInflationBriefingDriftBand,
} from '../inflation/team-consensus-inflation-briefing-drift.js';
import {
  assessMemoryCommonwealthInflationRecallGate,
  type MemoryCommonwealthInflationRecallGateBand,
} from '../inflation/memory-commonwealth-inflation-recall-gate.js';
import {
  assessAutomationSynthesisInflationCascadeDrift,
  type AutomationSynthesisInflationCascadeDriftBand,
} from '../inflation/automation-synthesis-inflation-cascade-drift.js';
import {
  assessUiShellInflationSalienceEscalation,
  type UiShellInflationSalienceEscalationBand,
} from '../inflation/ui-shell-inflation-salience-escalation.js';
import {
  assessDashboardHeatmapInflationOverlayCascade,
  type DashboardHeatmapInflationOverlayCascadeBand,
} from '../inflation/dashboard-heatmap-inflation-overlay-cascade.js';
import {
  assessCommandCenterInflationFusionLatch,
  type CommandCenterInflationFusionLatchBand,
} from '../inflation/command-center-inflation-fusion-latch.js';
import {
  assessTransportFreightInflationCongestionCascade,
  type TransportFreightInflationCongestionCascadeBand,
} from '../inflation/transport-freight-inflation-congestion-cascade.js';
import {
  assessEventsStagedInflationShockPersistence,
  type EventsStagedInflationShockPersistenceBand,
} from '../inflation/events-staged-inflation-shock-persistence.js';
import {
  assessModesSandboxInflationStressCascade,
  type ModesSandboxInflationStressCascadeBand,
} from '../inflation/modes-sandbox-inflation-stress-cascade.js';
import {
  assessFiscalAppropriationInflationPressureLatch,
  type FiscalAppropriationInflationPressureLatchBand,
} from '../inflation/fiscal-appropriation-inflation-pressure-latch.js';
import {
  assessHouseholdBudgetInflationStressCascade,
  type HouseholdBudgetInflationStressCascadeBand,
} from '../inflation/household-budget-inflation-stress-cascade.js';
import {
  assessCorporateSurvivalPricingInflationLatch,
  type CorporateSurvivalPricingInflationLatchBand,
} from '../inflation/corporate-survival-pricing-inflation-latch.js';
import {
  assessTradeTariffExchangeInflationEscalation,
  type TradeTariffExchangeInflationEscalationBand,
} from '../inflation/trade-tariff-exchange-inflation-escalation.js';
import {
  assessMetroCapacityRentInflationLatch,
  type MetroCapacityRentInflationLatchBand,
} from '../inflation/metro-capacity-rent-inflation-latch.js';
import {
  assessGridWholesaleTariffInflationSurge,
  type GridWholesaleTariffInflationSurgeBand,
} from '../inflation/grid-wholesale-tariff-inflation-surge.js';
import {
  assessGuardianCopilotInflationPressureLatch,
  type GuardianCopilotInflationPressureLatchBand,
} from '../inflation/guardian-copilot-inflation-pressure-latch.js';
import {
  assessTeamBriefingConsensusInflationUnmooring,
  type TeamBriefingConsensusInflationUnmooringBand,
} from '../inflation/team-briefing-consensus-inflation-unmooring.js';
import {
  assessMemoryRealmInflationPersistenceLatch,
  type MemoryRealmInflationPersistenceLatchBand,
} from '../inflation/memory-realm-inflation-persistence-latch.js';
import {
  assessAutomationSynthesisInflationCascadeSurge,
  type AutomationSynthesisInflationCascadeSurgeBand,
} from '../inflation/automation-synthesis-inflation-cascade-surge.js';
import {
  assessUiShellInflationAttentionLatch,
  type UiShellInflationAttentionLatchBand,
} from '../inflation/ui-shell-inflation-attention-latch.js';
import {
  assessDashboardRegionalInflationOverlaySurge,
  type DashboardRegionalInflationOverlaySurgeBand,
} from '../inflation/dashboard-regional-inflation-overlay-surge.js';
import {
  assessCommandCenterInflationAlertPressureLatch,
  type CommandCenterInflationAlertPressureLatchBand,
} from '../inflation/command-center-inflation-alert-pressure-latch.js';
import {
  assessTransportFreightInflationGridlockSurge,
  type TransportFreightInflationGridlockSurgeBand,
} from '../inflation/transport-freight-inflation-gridlock-surge.js';
import {
  assessEventsNarrativeInflationShockLatch,
  type EventsNarrativeInflationShockLatchBand,
} from '../inflation/events-narrative-inflation-shock-latch.js';
import {
  assessModesSandboxInflationPressureSurge,
  type ModesSandboxInflationPressureSurgeBand,
} from '../inflation/modes-sandbox-inflation-pressure-surge.js';
import {
  assessFiscalConsolidatedInflationPressureLatch,
  type FiscalConsolidatedInflationPressureLatchBand,
} from '../inflation/fiscal-consolidated-inflation-pressure-latch.js';
import {
  assessHouseholdWageInflationStressSurge,
  type HouseholdWageInflationStressSurgeBand,
} from '../inflation/household-wage-inflation-stress-surge.js';
import {
  assessMacroOutputGapInflationPressureLatch,
  type MacroOutputGapInflationPressureLatchBand,
} from '../inflation/macro-output-gap-inflation-pressure-latch.js';
import {
  assessCorporateCapacityMarkupInflationSurge,
  type CorporateCapacityMarkupInflationSurgeBand,
} from '../inflation/corporate-capacity-markup-inflation-surge.js';
import {
  assessResearchBreakthroughSupplySideInflationLatch,
  type ResearchBreakthroughSupplySideInflationLatchBand,
} from '../inflation/research-breakthrough-supply-side-inflation-latch.js';
import {
  assessTradeImportExchangeInflationPipelineSurge,
  type TradeImportExchangeInflationPipelineSurgeBand,
} from '../inflation/trade-import-exchange-inflation-pipeline-surge.js';
import {
  assessMetroRegionalRentInflationEscalationLatch,
  type MetroRegionalRentInflationEscalationLatchBand,
} from '../inflation/metro-regional-rent-inflation-escalation-latch.js';
import {
  assessWholesaleGridTransitionInflationSurge,
  type WholesaleGridTransitionInflationSurgeBand,
} from '../inflation/wholesale-grid-transition-inflation-surge.js';
import {
  assessTradeClearedForwardArcInflationHandoffLatch,
  type TradeClearedForwardArcInflationHandoffLatchBand,
} from '../inflation/trade-cleared-forward-arc-inflation-handoff-latch.js';
import {
  assessGuardianEntrustmentEnvelopeInflationPressureSurge,
  type GuardianEntrustmentEnvelopeInflationPressureSurgeBand,
} from '../inflation/guardian-entrustment-envelope-inflation-pressure-surge.js';
import {
  assessHousingWellbeingMortgageInflationEscalationLatch,
  type HousingWellbeingMortgageInflationEscalationLatchBand,
} from '../inflation/housing-wellbeing-mortgage-inflation-escalation-latch.js';
import {
  assessTransportCorridorFreightInflationSurgeLatch,
  type TransportCorridorFreightInflationSurgeLatchBand,
} from '../inflation/transport-corridor-freight-inflation-surge-latch.js';

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
  guardianInflationInterventionBand: GuardianInflationInterventionBand;
  teamIntelligenceConsensusBand: TeamIntelligenceConsensusBand;
  strategicGeopoliticalPremiumBand: StrategicGeopoliticalPremiumBand;
  aiMemoryInflationRecallBand: AiMemoryInflationRecallBand;
  calendarSeasonInflationCarryoverBand: CalendarSeasonInflationCarryoverBand;
  automationAutopilotInflationDriftBand: AutomationAutopilotInflationDriftBand;
  researchProductivityInflationOffsetBand: ResearchProductivityInflationOffsetBand;
  scenarioSandboxInflationBiasBand: ScenarioSandboxInflationBiasBand;
  eventsNarrativeInflationPersistenceBand: EventsNarrativeInflationPersistenceBand;
  macroDemandOverheatInflationSlippageBand: MacroDemandOverheatInflationSlippageBand;
  freightLogisticsInflationCongestionBand: FreightLogisticsInflationCongestionBand;
  housingWellbeingInflationEssentialStressBand: HousingWellbeingInflationEssentialStressBand;
  commandCenterInflationFusionEscalationBand: CommandCenterInflationFusionEscalationBand;
  uiPlayerInflationSalienceNudgeBand: UiPlayerInflationSalienceNudgeBand;
  fiscalIndexationInflationAnchorBreachBand: FiscalIndexationInflationAnchorBreachBand;
  householdWageInflationDeanchoringBand: HouseholdWageInflationDeanchoringBand;
  corporateMarkupInflationCascadeBand: CorporateMarkupInflationCascadeBand;
  tradeTariffImportInflationPipelineBand: TradeTariffImportInflationPipelineBand;
  metroUrbanRentInflationSurgeBand: MetroUrbanRentInflationSurgeBand;
  wholesaleGridEnergyInflationCascadeBand: WholesaleGridEnergyInflationCascadeBand;
  guardianGuardrailInflationEscalationBand: GuardianGuardrailInflationEscalationBand;
  teamConsensusInflationBriefingDriftBand: TeamConsensusInflationBriefingDriftBand;
  memoryCommonwealthInflationRecallGateBand: MemoryCommonwealthInflationRecallGateBand;
  automationSynthesisInflationCascadeDriftBand: AutomationSynthesisInflationCascadeDriftBand;
  uiShellInflationSalienceEscalationBand: UiShellInflationSalienceEscalationBand;
  dashboardHeatmapInflationOverlayCascadeBand: DashboardHeatmapInflationOverlayCascadeBand;
  commandCenterInflationFusionLatchBand: CommandCenterInflationFusionLatchBand;
  transportFreightInflationCongestionCascadeBand: TransportFreightInflationCongestionCascadeBand;
  eventsStagedInflationShockPersistenceBand: EventsStagedInflationShockPersistenceBand;
  modesSandboxInflationStressCascadeBand: ModesSandboxInflationStressCascadeBand;
  fiscalAppropriationInflationPressureLatchBand: FiscalAppropriationInflationPressureLatchBand;
  householdBudgetInflationStressCascadeBand: HouseholdBudgetInflationStressCascadeBand;
  corporateSurvivalPricingInflationLatchBand: CorporateSurvivalPricingInflationLatchBand;
  tradeTariffExchangeInflationEscalationBand: TradeTariffExchangeInflationEscalationBand;
  metroCapacityRentInflationLatchBand: MetroCapacityRentInflationLatchBand;
  gridWholesaleTariffInflationSurgeBand: GridWholesaleTariffInflationSurgeBand;
  guardianCopilotInflationPressureLatchBand: GuardianCopilotInflationPressureLatchBand;
  teamBriefingConsensusInflationUnmooringBand: TeamBriefingConsensusInflationUnmooringBand;
  memoryRealmInflationPersistenceLatchBand: MemoryRealmInflationPersistenceLatchBand;
  automationSynthesisInflationCascadeSurgeBand: AutomationSynthesisInflationCascadeSurgeBand;
  uiShellInflationAttentionLatchBand: UiShellInflationAttentionLatchBand;
  dashboardRegionalInflationOverlaySurgeBand: DashboardRegionalInflationOverlaySurgeBand;
  commandCenterInflationAlertPressureLatchBand: CommandCenterInflationAlertPressureLatchBand;
  transportFreightInflationGridlockSurgeBand: TransportFreightInflationGridlockSurgeBand;
  eventsNarrativeInflationShockLatchBand: EventsNarrativeInflationShockLatchBand;
  modesSandboxInflationPressureSurgeBand: ModesSandboxInflationPressureSurgeBand;
  fiscalConsolidatedInflationPressureLatchBand: FiscalConsolidatedInflationPressureLatchBand;
  householdWageInflationStressSurgeBand: HouseholdWageInflationStressSurgeBand;
  macroOutputGapInflationPressureLatchBand: MacroOutputGapInflationPressureLatchBand;
  corporateCapacityMarkupInflationSurgeBand: CorporateCapacityMarkupInflationSurgeBand;
  researchBreakthroughSupplySideInflationLatchBand: ResearchBreakthroughSupplySideInflationLatchBand;
  tradeImportExchangeInflationPipelineSurgeBand: TradeImportExchangeInflationPipelineSurgeBand;
  metroRegionalRentInflationEscalationLatchBand: MetroRegionalRentInflationEscalationLatchBand;
  wholesaleGridTransitionInflationSurgeBand: WholesaleGridTransitionInflationSurgeBand;
  tradeClearedForwardArcInflationHandoffLatchBand: TradeClearedForwardArcInflationHandoffLatchBand;
  guardianEntrustmentEnvelopeInflationPressureSurgeBand: GuardianEntrustmentEnvelopeInflationPressureSurgeBand;
  housingWellbeingMortgageInflationEscalationLatchBand: HousingWellbeingMortgageInflationEscalationLatchBand;
  transportCorridorFreightInflationSurgeLatchBand: TransportCorridorFreightInflationSurgeLatchBand;
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
    const guardianIntervention = assessGuardianInflationInterventionInflation({
      inflationGuardrailTripped: inputs.highInflationScenario,
      stabilityInterventionBand:
        inputs.publicStability < 40 ? 'urgent' : inputs.fiscalPressure === 'critical' ? 'advisory' : 'none',
      narrativeShockSeverity: inputs.publicStability < 45 ? 'high' : inputs.publicStability < 55 ? 'medium' : 'low',
      copilotInflationEscalationActive: inputs.householdInflationScenarioActive,
      guardrailNarrativeCascadeBand: inputs.creditShockActive ? 'urgent' : inputs.highInflationScenario ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const teamConsensus = assessTeamIntelligenceConsensusInflation({
      consensusInflationOutlook: inputs.highInflationScenario ? 'upside_risk' : 'reacceleration',
      briefingUrgencyBand: inputs.publicStability < 42 ? 'critical' : inputs.householdInflationScenarioActive ? 'elevated' : 'routine',
      crossDomainStressScore: inputs.actorCreditStressIndex ?? 0.35,
      teamForecastDeanchoringFlag: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      briefingInflationSalienceBand: inputs.publicStability < 38 ? 'critical' : inputs.publicStability < 48 ? 'elevated' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const strategicPremium = assessStrategicGeopoliticalInflationPremium({
      nationalPriorityInflationBias: inputs.highInflationScenario ? 'expansionary' : 'neutral',
      strategicStockpileStress: inputs.creditShockActive,
      geopoliticalRiskPremium: inputs.fiscalPressure === 'critical' ? 0.68 : 0.4,
      expansionaryPriorityCascadeActive: inputs.highInflationScenario && inputs.creditShockActive,
      strategicInflationRiskBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'elevated' : 'low',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const memoryRecall = assessAiMemoryInflationRecallInflation({
      recalledInflationRegimeConfidence: inputs.highInflationScenario ? 0.8 : 0.52,
      narrativeDriftTowardHigherInflation: inputs.householdInflationScenarioActive,
      explainabilityAlertActive: inputs.publicStability < 45,
      memoryInflationRecallCascade: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      explainabilityInflationSalienceBand: inputs.publicStability < 40 ? 'critical' : inputs.publicStability < 50 ? 'elevated' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const calendarCarryover = assessCalendarSeasonInflationCarryover({
      calendarSeasonBand: inputs.highInflationScenario ? 'peak_demand' : 'normal',
      policyReviewWindowOpen: inputs.fiscalPressure === 'critical',
      multiTurnInflationCarryover: inputs.householdInflationScenarioActive ? 0.28 : 0.1,
      fiscalCalendarInflationLatch: inputs.creditShockActive,
      multiTurnCarryoverBand: inputs.highInflationScenario ? 'persistent' : 'building',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const automationDrift = assessAutomationAutopilotInflationDrift({
      macroAutopilotInflationBias: inputs.highInflationScenario ? 'inflate' : 'neutral',
      unattendedShockDriftActive: inputs.creditShockActive,
      automationConfidenceScore: inputs.publicStability < 45 ? 0.4 : 0.65,
      idleMacroInflationEscalation: inputs.householdInflationScenarioActive,
      autopilotDriftCascadeBand: inputs.fiscalPressure === 'critical' ? 'runaway' : inputs.creditShockActive ? 'drifting' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const researchOffset = assessResearchProductivityInflationOffset({
      productivityGainBand: inputs.highInflationScenario ? 'flat' : inputs.creditShockActive ? 'moderate' : 'strong',
      supplySideReliefActive: !inputs.creditShockActive || inputs.householdInflationScenarioActive,
      innovationInflationOffsetScore: inputs.highInflationScenario ? 0.38 : 0.62,
      techTreeInflationLatch: inputs.creditShockActive,
      supplySideOffsetBand:
        inputs.fiscalPressure === 'critical' ? 'weak' : inputs.householdInflationScenarioActive ? 'building' : 'strong',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const scenarioBias = assessScenarioSandboxInflationBias({
      scenarioInflationBias: inputs.highInflationScenario ? 'extreme' : inputs.creditShockActive ? 'inflationary' : 'neutral',
      sandboxStressModeActive: inputs.creditShockActive || inputs.fiscalPressure === 'critical',
      difficultyCostMultiplier: inputs.fiscalPressure === 'critical' ? 1.2 : 1.05,
      difficultyInflationCascade: inputs.householdInflationScenarioActive,
      sandboxStressInflationBand: inputs.publicStability < 40 ? 'extreme' : inputs.publicStability < 50 ? 'stressed' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventsPersistence = assessEventsNarrativeInflationPersistence({
      inflationShockEventActive: inputs.creditShockActive || inputs.highInflationScenario,
      supplyDisruptionSeverity: inputs.highInflationScenario ? 'national' : inputs.creditShockActive ? 'localized' : 'none',
      confidenceShockBand: inputs.publicStability < 40 ? 'severe' : inputs.publicStability < 50 ? 'uneasy' : 'calm',
      dynamicEventInflationLatch: inputs.householdInflationScenarioActive,
      supplyShockPersistenceBand:
        inputs.fiscalPressure === 'critical' ? 'entrenched' : inputs.creditShockActive ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const macroSlippage = assessMacroDemandOverheatInflationSlippage({
      gdpGrowthBand: inputs.highInflationScenario ? 'strong' : inputs.creditShockActive ? 'steady' : 'slow',
      nominalDemandPressure: inputs.highInflationScenario ? 0.72 : inputs.creditShockActive ? 0.48 : 0.22,
      outputGap: inputs.highInflationScenario ? 0.38 : 0.1,
      macroDemandOverheatLatch: inputs.highInflationScenario && inputs.householdInflationScenarioActive,
      transmissionSlippageBand:
        inputs.systemicLiquidityBand === 'critical' ? 'dislocated' : inputs.fiscalPressure === 'critical' ? 'slipping' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const freightCongestion = assessFreightLogisticsInflationCongestion({
      freightCapacityBand: inputs.creditShockActive ? 'critical' : inputs.highInflationScenario ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.highInflationScenario,
      portBacklogBand: inputs.fiscalPressure === 'critical' ? 'severe' : inputs.creditShockActive ? 'moderate' : 'clear',
      logisticsInflationLatch: inputs.householdInflationScenarioActive,
      freightCongestionBand:
        inputs.systemicLiquidityBand === 'critical' ? 'gridlocked' : inputs.creditShockActive ? 'building' : 'clear',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const housingStress = assessHousingWellbeingInflationEssentialStress({
      mortgageStressBand: inputs.householdInflationScenarioActive ? 'severe' : inputs.creditShockActive ? 'elevated' : 'low',
      wellbeingCostBand: inputs.publicStability < 42 ? 'critical' : inputs.publicStability < 52 ? 'strained' : 'stable',
      essentialServicesInflationFlag: inputs.householdInflationScenarioActive,
      shelterEssentialInflationLatch: inputs.creditShockActive,
      mortgageWellbeingStressBand:
        inputs.fiscalPressure === 'critical' ? 'acute' : inputs.householdInflationScenarioActive ? 'strained' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commandFusion = assessCommandCenterInflationFusionEscalation({
      macroAlertLevel: inputs.highInflationScenario ? 'red' : inputs.creditShockActive ? 'amber' : 'green',
      inflationFusionScore: inputs.highInflationScenario ? 0.8 : inputs.fiscalPressure === 'critical' ? 0.68 : 0.45,
      coordinatedTighteningSuggested: inputs.fiscalPressure === 'critical',
      macroInflationFusionLatch: inputs.householdInflationScenarioActive,
      commandAlertCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.creditShockActive ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiSalienceNudge = assessUiPlayerInflationSalienceNudge({
      inflationDashboardStressHighlight: inputs.highInflationScenario,
      playerAttentionOnCostOfLiving: inputs.publicStability < 44 ? 'high' : inputs.householdInflationScenarioActive ? 'medium' : 'low',
      uiNudgeInflationExpectationsUp: inputs.householdInflationScenarioActive,
      playerInflationSalienceLatch: inputs.creditShockActive,
      uiExpectationsNudgeBand: inputs.publicStability < 40 ? 'sharp' : inputs.fiscalPressure === 'critical' ? 'building' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const fiscalBreach = assessFiscalIndexationInflationAnchorBreach({
      consolidatedDeficitBand: inputs.fiscalPressure === 'critical' ? 'large_deficit' : 'moderate_deficit',
      debtServicePressure: inputs.fiscalPressure === 'critical' ? 'critical' : inputs.sovereignDebtPressure === 'elevated' ? 'elevated' : 'moderate',
      fiscalAnchorBreached: inputs.highInflationScenario,
      debtIndexationInflationLatch: inputs.householdInflationScenarioActive,
      fiscalPassThroughCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'runaway' : inputs.creditShockActive ? 'building' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const householdDeanchoring = assessHouseholdWageInflationDeanchoring({
      wageGrowthBand: inputs.highInflationScenario ? 'surge' : inputs.householdInflationScenarioActive ? 'elevated' : 'moderate',
      costOfLivingStress: inputs.publicStability < 40 ? 'extreme' : inputs.publicStability < 50 ? 'high' : 'moderate',
      householdExpectationsDeanchoring: inputs.householdInflationScenarioActive,
      wagePriceSpiralLatch: inputs.creditShockActive,
      householdDeanchoringBand:
        inputs.fiscalPressure === 'critical' ? 'unmoored' : inputs.highInflationScenario ? 'drifting' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const markupCascade = assessCorporateMarkupInflationCascade({
      pricingPowerBand: inputs.highInflationScenario ? 'dominant' : inputs.creditShockActive ? 'strong' : 'moderate',
      passThroughIntent: inputs.highInflationScenario ? 'full' : 'partial',
      marginCompression: inputs.fiscalPressure === 'critical' ? 'severe' : 'mild',
      corporatePricingInflationLatch: inputs.householdInflationScenarioActive,
      markupPassThroughCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'full' : inputs.creditShockActive ? 'partial' : 'absorbed',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tariffPipeline = assessTradeTariffImportInflationPipeline({
      tradeOpennessBand: 'open',
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.highInflationScenario ? 'depreciation' : 'stable',
      commodityImportShare: 0.4,
      importTariffInflationLatch: inputs.creditShockActive,
      exchangePipelineStressBand:
        inputs.systemicLiquidityBand === 'critical' ? 'ruptured' : inputs.fiscalPressure === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const metroSurge = assessMetroUrbanRentInflationSurge({
      vacancyBand: inputs.highInflationScenario ? 'critical' : inputs.creditShockActive ? 'tight' : 'balanced',
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'surging' : inputs.highInflationScenario ? 'strong' : 'moderate',
      urbanizationPressure: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      urbanRentInflationLatch: inputs.creditShockActive,
      metroDispersionStressBand:
        inputs.publicStability < 42 ? 'critical' : inputs.householdInflationScenarioActive ? 'widening' : 'aligned',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const gridCascade = assessWholesaleGridEnergyInflationCascade({
      wholesaleEnergyStress: inputs.highInflationScenario ? 'crisis' : inputs.creditShockActive ? 'severe' : 'elevated',
      retailTariffShock: inputs.creditShockActive,
      gridReliabilityBand: inputs.systemicLiquidityBand === 'critical' ? 'fragile' : 'stable',
      gridTariffInflationLatch: inputs.householdInflationScenarioActive,
      wholesaleStressCascadeBand: inputs.fiscalPressure === 'critical' ? 'cascade' : inputs.creditShockActive ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const guardianEscalation = assessGuardianGuardrailInflationEscalation({
      inflationGuardrailTripped: inputs.highInflationScenario,
      stabilityInterventionBand: inputs.publicStability < 40 ? 'urgent' : inputs.fiscalPressure === 'critical' ? 'advisory' : 'none',
      narrativeShockSeverity: inputs.publicStability < 45 ? 'high' : inputs.creditShockActive ? 'medium' : 'low',
      guardrailInflationLatch: inputs.householdInflationScenarioActive,
      copilotEscalationBand: inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.creditShockActive ? 'elevated' : 'calm',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const briefingDrift = assessTeamConsensusInflationBriefingDrift({
      consensusInflationOutlook: inputs.highInflationScenario ? 'upside_risk' : inputs.creditShockActive ? 'reacceleration' : 'stable',
      briefingUrgencyBand: inputs.publicStability < 42 ? 'critical' : inputs.householdInflationScenarioActive ? 'elevated' : 'routine',
      crossDomainStressScore: inputs.actorCreditStressIndex ?? 0.4,
      teamBriefingInflationLatch: inputs.creditShockActive,
      consensusDriftBand: inputs.fiscalPressure === 'critical' ? 'unmoored' : inputs.highInflationScenario ? 'drifting' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const memoryRecallGate = assessMemoryCommonwealthInflationRecallGate({
      recalledInflationRegimeConfidence: inputs.highInflationScenario ? 0.78 : 0.42,
      narrativeDriftTowardHigherInflation: inputs.creditShockActive,
      explainabilityAlertActive: inputs.householdInflationScenarioActive,
      memoryCommonwealthInflationLatch: inputs.highInflationScenario,
      realmRecallGateBand: inputs.fiscalPressure === 'critical' ? 'breached' : inputs.creditShockActive ? 'opening' : 'sealed',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const synthesisCascade = assessAutomationSynthesisInflationCascadeDrift({
      macroAutopilotInflationBias: inputs.highInflationScenario ? 'inflate' : 'neutral',
      unattendedShockDriftActive: inputs.creditShockActive,
      automationConfidenceScore: inputs.publicStability < 38 ? 0.32 : 0.58,
      synthesisAutopilotInflationLatch: inputs.householdInflationScenarioActive,
      cascadeStackDriftBand: inputs.systemicLiquidityBand === 'critical' ? 'runaway' : inputs.fiscalPressure === 'critical' ? 'stacking' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiSalienceEscalation = assessUiShellInflationSalienceEscalation({
      inflationDashboardStressHighlight: inputs.highInflationScenario,
      playerAttentionOnCostOfLiving: inputs.householdInflationScenarioActive ? 'high' : inputs.creditShockActive ? 'medium' : 'low',
      uiNudgeInflationExpectationsUp: inputs.creditShockActive,
      wave35SalienceEscalationLatch: inputs.householdInflationScenarioActive,
      shellExpectationsEscalationBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.highInflationScenario ? 'building' : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const heatmapOverlay = assessDashboardHeatmapInflationOverlayCascade({
      regionalHeatmapInflationAlert: inputs.highInflationScenario,
      mapLayerCostPressureScore: inputs.actorCreditStressIndex ?? 0.45,
      dashboardRefreshUrgency: inputs.publicStability < 42 ? 'critical' : inputs.creditShockActive ? 'elevated' : 'routine',
      regionalInflationOverlayLatch: inputs.creditShockActive,
      heatmapOverlayCascadeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'widening' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commandFusionLatch = assessCommandCenterInflationFusionLatch({
      macroAlertLevel: inputs.highInflationScenario ? 'red' : inputs.creditShockActive ? 'amber' : 'green',
      inflationFusionScore: inputs.actorCreditStressIndex ?? 0.42,
      coordinatedTighteningSuggested: inputs.creditShockActive,
      wave36FusionLatch: inputs.householdInflationScenarioActive,
      commandInflationEscalationBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.highInflationScenario ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const freightCascade = assessTransportFreightInflationCongestionCascade({
      freightCapacityBand: inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.creditShockActive ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.creditShockActive,
      portBacklogBand: inputs.publicStability < 40 ? 'severe' : inputs.fiscalPressure === 'critical' ? 'moderate' : 'clear',
      wave36LogisticsInflationLatch: inputs.householdInflationScenarioActive,
      freightCascadeCongestionBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.highInflationScenario ? 'building' : 'clear',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventShockPersistence = assessEventsStagedInflationShockPersistence({
      inflationShockEventActive: inputs.highInflationScenario,
      supplyDisruptionSeverity: inputs.creditShockActive ? 'national' : inputs.fiscalPressure === 'critical' ? 'localized' : 'none',
      confidenceShockBand: inputs.publicStability < 42 ? 'severe' : inputs.creditShockActive ? 'uneasy' : 'calm',
      wave37EventInflationLatch: inputs.creditShockActive,
      stagedShockPersistenceBand:
        inputs.fiscalPressure === 'critical' ? 'entrenched' : inputs.highInflationScenario ? 'building' : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const sandboxStressCascade = assessModesSandboxInflationStressCascade({
      scenarioInflationBias: inputs.highInflationScenario ? 'extreme' : inputs.householdInflationScenarioActive ? 'inflationary' : 'neutral',
      sandboxStressModeActive: inputs.householdInflationScenarioActive,
      difficultyCostMultiplier: inputs.inflationSettingMultiplier ?? 1,
      wave37SandboxInflationLatch: inputs.householdInflationScenarioActive,
      scenarioBiasCascadeBand:
        inputs.fiscalPressure === 'critical' ? 'runaway' : inputs.creditShockActive ? 'stressed' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const appropriationLatch = assessFiscalAppropriationInflationPressureLatch({
      consolidatedDeficitBand: inputs.fiscalPressure === 'critical' ? 'large_deficit' : inputs.creditShockActive ? 'moderate_deficit' : 'balanced',
      debtServicePressure: inputs.fiscalPressure === 'critical' ? 'critical' : inputs.creditShockActive ? 'elevated' : 'moderate',
      wave38AppropriationInflationLatch: inputs.highInflationScenario,
      fiscalPressureEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const budgetStressCascade = assessHouseholdBudgetInflationStressCascade({
      wageGrowthBand: inputs.householdInflationScenarioActive ? 'surge' : inputs.highInflationScenario ? 'elevated' : 'moderate',
      costOfLivingStress: inputs.publicStability < 42 ? 'extreme' : inputs.publicStability < 50 ? 'high' : 'moderate',
      wave38BudgetInflationLatch: inputs.householdInflationScenarioActive,
      householdStressCascadeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.creditShockActive ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const survivalPricing = assessCorporateSurvivalPricingInflationLatch({
      pricingPowerBand: inputs.highInflationScenario ? 'dominant' : inputs.creditShockActive ? 'strong' : 'moderate',
      passThroughIntent: inputs.fiscalPressure === 'critical' ? 'full' : inputs.householdInflationScenarioActive ? 'partial' : 'absorb',
      marginCompression: inputs.creditShockActive ? 'severe' : 'mild',
      wave39SurvivalPricingLatch: inputs.householdInflationScenarioActive,
      corporateMarkupEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'dominant' : inputs.highInflationScenario ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tariffExchange = assessTradeTariffExchangeInflationEscalation({
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.highInflationScenario ? 'depreciation' : 'stable',
      tradeOpennessBand: 'open',
      commodityImportShare: 0.4,
      wave39TariffExchangeLatch: inputs.creditShockActive,
      importExchangeEscalationBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const metroCapacityRent = assessMetroCapacityRentInflationLatch({
      vacancyBand: inputs.householdInflationScenarioActive
        ? 'critical'
        : inputs.highInflationScenario
          ? 'tight'
          : 'balanced',
      rentGrowthBand: inputs.highInflationScenario ? 'surging' : inputs.householdInflationScenarioActive ? 'strong' : 'moderate',
      wave40UrbanRentLatch: inputs.householdInflationScenarioActive,
      metroCapacityStressBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.creditShockActive ? 'strained' : 'aligned',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const gridWholesaleTariff = assessGridWholesaleTariffInflationSurge({
      wholesaleEnergyStress:
        inputs.systemicLiquidityBand === 'critical'
          ? 'crisis'
          : inputs.creditShockActive
            ? 'severe'
            : inputs.highInflationScenario
              ? 'elevated'
              : 'calm',
      retailTariffShock: inputs.creditShockActive,
      wave40GridTariffLatch: inputs.creditShockActive,
      wholesaleTariffCascadeBand:
        inputs.fiscalPressure === 'critical' ? 'cascade' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const guardianCopilotPressure = assessGuardianCopilotInflationPressureLatch({
      inflationGuardrailTripped: inputs.highInflationScenario || inputs.creditShockActive,
      stabilityInterventionBand:
        inputs.fiscalPressure === 'critical' ? 'urgent' : inputs.publicStability < 45 ? 'advisory' : 'none',
      wave41GuardianPressureLatch: inputs.householdInflationScenarioActive,
      copilotPressureEscalationBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'runaway'
          : inputs.highInflationScenario
            ? 'elevated'
            : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const teamBriefingUnmooring = assessTeamBriefingConsensusInflationUnmooring({
      consensusInflationOutlook: inputs.highInflationScenario ? 'upside_risk' : inputs.creditShockActive ? 'reacceleration' : 'stable',
      briefingUrgencyBand: inputs.creditShockActive ? 'critical' : inputs.householdInflationScenarioActive ? 'elevated' : 'routine',
      wave41TeamConsensusLatch: inputs.creditShockActive,
      briefingConsensusUnmoorBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'drifting' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const memoryRealmPersistence = assessMemoryRealmInflationPersistenceLatch({
      recalledInflationRegimeConfidence: inputs.highInflationScenario ? 0.8 : 0.5,
      narrativeDriftTowardHigherInflation: inputs.highInflationScenario,
      wave42MemoryRecallLatch: inputs.householdInflationScenarioActive,
      realmPersistenceGateBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.creditShockActive ? 'slipping' : 'anchored',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const automationCascadeSurge = assessAutomationSynthesisInflationCascadeSurge({
      macroAutopilotInflationBias: inputs.highInflationScenario ? 'inflate' : inputs.creditShockActive ? 'neutral' : 'deflate',
      unattendedShockDriftActive: inputs.creditShockActive,
      wave42SynthesisCascadeLatch: inputs.creditShockActive,
      autopilotStackSurgeBand:
        inputs.systemicLiquidityBand === 'critical' ? 'surge' : inputs.fiscalPressure === 'critical' ? 'stacking' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const uiShellAttention = assessUiShellInflationAttentionLatch({
      inflationDashboardStressHighlight: inputs.highInflationScenario,
      playerAttentionOnCostOfLiving: inputs.householdInflationScenarioActive
        ? 'high'
        : inputs.creditShockActive
          ? 'medium'
          : 'low',
      wave43ShellAttentionLatch: inputs.householdInflationScenarioActive,
      playerSaliencePressureBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.highInflationScenario
            ? 'elevated'
            : 'muted',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const dashboardOverlaySurge = assessDashboardRegionalInflationOverlaySurge({
      regionalHeatmapInflationAlert: inputs.highInflationScenario || inputs.creditShockActive,
      mapLayerCostPressureScore: inputs.fiscalPressure === 'critical' ? 0.75 : 0.45,
      wave43HeatmapOverlayLatch: inputs.creditShockActive,
      regionalOverlaySurgeBand:
        inputs.fiscalPressure === 'critical' ? 'surge' : inputs.systemicLiquidityBand === 'critical' ? 'widening' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const commandAlertPressure = assessCommandCenterInflationAlertPressureLatch({
      macroAlertLevel: inputs.highInflationScenario ? 'red' : inputs.creditShockActive ? 'amber' : 'green',
      inflationFusionScore: inputs.fiscalPressure === 'critical' ? 0.8 : 0.5,
      wave44CommandAlertLatch: inputs.householdInflationScenarioActive,
      commandAlertPressureBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'critical'
          : inputs.highInflationScenario
            ? 'elevated'
            : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const freightGridlockSurge = assessTransportFreightInflationGridlockSurge({
      freightCapacityBand: inputs.fiscalPressure === 'critical' ? 'critical' : inputs.creditShockActive ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.creditShockActive,
      wave44FreightGridlockLatch: inputs.creditShockActive,
      freightGridlockSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'clear',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const eventsNarrativeShock = assessEventsNarrativeInflationShockLatch({
      inflationShockEventActive: inputs.highInflationScenario || inputs.creditShockActive,
      supplyDisruptionSeverity:
        inputs.fiscalPressure === 'critical' ? 'national' : inputs.creditShockActive ? 'localized' : 'none',
      wave45EventShockLatch: inputs.householdInflationScenarioActive,
      narrativeShockEntrenchBand:
        inputs.systemicLiquidityBand === 'critical'
          ? 'entrenched'
          : inputs.fiscalPressure === 'critical'
            ? 'building'
            : 'none',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const modesSandboxPressure = assessModesSandboxInflationPressureSurge({
      scenarioInflationBias: inputs.highInflationScenario ? 'extreme' : inputs.householdInflationScenarioActive ? 'inflationary' : 'neutral',
      sandboxStressModeActive: inputs.householdInflationScenarioActive,
      wave45SandboxPressureLatch: inputs.creditShockActive,
      scenarioStressSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'surge' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'routine',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const fiscalConsolidatedPressure = assessFiscalConsolidatedInflationPressureLatch({
      consolidatedDeficitBand:
        inputs.fiscalPressure === 'critical' ? 'large_deficit' : inputs.creditShockActive ? 'moderate_deficit' : 'balanced',
      debtServicePressure:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.systemicLiquidityBand === 'critical' ? 'elevated' : 'moderate',
      wave46FiscalPressureLatch: inputs.householdInflationScenarioActive,
      consolidatedDeficitEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.highInflationScenario ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const householdWageStress = assessHouseholdWageInflationStressSurge({
      wageGrowthBand: inputs.householdInflationScenarioActive ? 'surge' : inputs.highInflationScenario ? 'elevated' : 'moderate',
      costOfLivingStress: inputs.publicStability < 42 ? 'extreme' : inputs.publicStability < 50 ? 'high' : 'moderate',
      wave46HouseholdStressLatch: inputs.creditShockActive,
      wageStressSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const macroOutputGapLatch = assessMacroOutputGapInflationPressureLatch({
      gdpGrowthBand: inputs.highInflationScenario ? 'strong' : inputs.creditShockActive ? 'steady' : 'slow',
      outputGap: inputs.householdInflationScenarioActive ? 0.48 : inputs.highInflationScenario ? 0.32 : 0.08,
      wave47MacroOutputGapLatch: inputs.householdInflationScenarioActive,
      outputGapEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'elevated' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const corporateCapacitySurge = assessCorporateCapacityMarkupInflationSurge({
      pricingPowerBand: inputs.highInflationScenario ? 'dominant' : inputs.creditShockActive ? 'strong' : 'moderate',
      marginCompression: inputs.fiscalPressure === 'critical' ? 'mild' : 'none',
      wave47CorporateCapacityLatch: inputs.creditShockActive,
      capacityMarkupSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const researchBreakthroughLatch = assessResearchBreakthroughSupplySideInflationLatch({
      productivityGainBand: inputs.highInflationScenario ? 'flat' : inputs.householdInflationScenarioActive ? 'moderate' : 'strong',
      supplySideReliefActive: !inputs.householdInflationScenarioActive,
      wave48ResearchBreakthroughLatch: inputs.householdInflationScenarioActive,
      researchSupplySideFailureBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tradeImportPipelineSurge = assessTradeImportExchangeInflationPipelineSurge({
      tradeOpennessBand: inputs.highInflationScenario ? 'open' : 'mixed',
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.householdInflationScenarioActive ? 'depreciation' : 'stable',
      wave48TradeImportPipelineLatch: inputs.creditShockActive,
      importExchangePipelineSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const metroRegionalRentEscalation = assessMetroRegionalRentInflationEscalationLatch({
      rentGrowthBand: inputs.householdInflationScenarioActive ? 'surging' : inputs.highInflationScenario ? 'strong' : 'moderate',
      regionalDispersionScore: inputs.householdInflationScenarioActive ? 0.58 : inputs.highInflationScenario ? 0.42 : 0.22,
      wave49MetroRegionalRentLatch: inputs.householdInflationScenarioActive,
      regionalRentEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'critical' : inputs.fiscalPressure === 'critical' ? 'building' : 'contained',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const wholesaleGridTransitionSurge = assessWholesaleGridTransitionInflationSurge({
      wholesaleEnergyStress: inputs.systemicLiquidityBand === 'critical' ? 'crisis' : inputs.creditShockActive ? 'severe' : 'elevated',
      emissionsTransitionCostBand: inputs.fiscalPressure === 'critical' ? 'high' : 'medium',
      wave49GridTransitionSurgeLatch: inputs.creditShockActive,
      gridTransitionStressBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'stressed' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const tradeClearedForwardArcHandoff = assessTradeClearedForwardArcInflationHandoffLatch({
      tradeOpennessBand: inputs.highInflationScenario ? 'open' : 'mixed',
      exchangeRatePressure: inputs.creditShockActive ? 'sharp_depreciation' : inputs.householdInflationScenarioActive ? 'depreciation' : 'stable',
      wave49ClearedForwardArcHandoffLatch: inputs.creditShockActive,
      clearedForwardArcHandoffContinuityBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'strained' : 'stable',
      inflationBand: r.state.inflation,
      turn: t,
    });
    const guardianEntrustmentEnvelope = assessGuardianEntrustmentEnvelopeInflationPressureSurge({
      inflationGuardrailTripped: inputs.highInflationScenario,
      stabilityInterventionBand:
        inputs.publicStability < 38 ? 'urgent' : inputs.fiscalPressure === 'critical' ? 'advisory' : 'none',
      wave49EntrustmentEnvelopeLatch: inputs.householdInflationScenarioActive,
      entrustmentEnvelopePressureBand:
        inputs.systemicLiquidityBand === 'critical' ? 'ruptured' : inputs.publicStability < 45 ? 'elevated' : 'contained',
      entrustmentStrainIndex: inputs.publicStability < 42 ? 0.76 : 0.48,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const housingWellbeingMortgageEscalation = assessHousingWellbeingMortgageInflationEscalationLatch({
      mortgageStressBand:
        inputs.householdInflationScenarioActive ? 'severe' : inputs.highInflationScenario ? 'elevated' : 'low',
      wellbeingCostBand:
        inputs.fiscalPressure === 'critical' ? 'critical' : inputs.householdInflationScenarioActive ? 'strained' : 'stable',
      wave50HousingWellbeingEscalationLatch: inputs.householdInflationScenarioActive,
      mortgageWellbeingEscalationBand:
        inputs.systemicLiquidityBand === 'critical' ? 'acute' : inputs.fiscalPressure === 'critical' ? 'building' : 'contained',
      essentialServicesInflationFlag: inputs.householdInflationScenarioActive,
      inflationBand: r.state.inflation,
      turn: t,
    });
    const transportCorridorFreightSurge = assessTransportCorridorFreightInflationSurgeLatch({
      freightCapacityBand: inputs.creditShockActive ? 'critical' : inputs.highInflationScenario ? 'tight' : 'balanced',
      fuelSurchargeActive: inputs.creditShockActive,
      wave50FreightCorridorSurgeLatch: inputs.creditShockActive,
      corridorFreightSurgeBand:
        inputs.fiscalPressure === 'critical' ? 'ruptured' : inputs.systemicLiquidityBand === 'critical' ? 'building' : 'clear',
      portBacklogBand:
        inputs.systemicLiquidityBand === 'critical' ? 'severe' : inputs.creditShockActive ? 'moderate' : 'clear',
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
      guardianInflationInterventionBand: guardianIntervention.interventionBand,
      teamIntelligenceConsensusBand: teamConsensus.consensusBand,
      strategicGeopoliticalPremiumBand: strategicPremium.premiumBand,
      aiMemoryInflationRecallBand: memoryRecall.recallBand,
      calendarSeasonInflationCarryoverBand: calendarCarryover.carryoverBand,
      automationAutopilotInflationDriftBand: automationDrift.driftBand,
      researchProductivityInflationOffsetBand: researchOffset.offsetBand,
      scenarioSandboxInflationBiasBand: scenarioBias.biasBand,
      eventsNarrativeInflationPersistenceBand: eventsPersistence.persistenceBand,
      macroDemandOverheatInflationSlippageBand: macroSlippage.slippageBand,
      freightLogisticsInflationCongestionBand: freightCongestion.congestionBand,
      housingWellbeingInflationEssentialStressBand: housingStress.stressBand,
      commandCenterInflationFusionEscalationBand: commandFusion.escalationBand,
      uiPlayerInflationSalienceNudgeBand: uiSalienceNudge.nudgeBand,
      fiscalIndexationInflationAnchorBreachBand: fiscalBreach.breachBand,
      householdWageInflationDeanchoringBand: householdDeanchoring.deanchoringBand,
      corporateMarkupInflationCascadeBand: markupCascade.cascadeBand,
      tradeTariffImportInflationPipelineBand: tariffPipeline.pipelineBand,
      metroUrbanRentInflationSurgeBand: metroSurge.surgeBand,
      wholesaleGridEnergyInflationCascadeBand: gridCascade.cascadeBand,
      guardianGuardrailInflationEscalationBand: guardianEscalation.escalationBand,
      teamConsensusInflationBriefingDriftBand: briefingDrift.driftBand,
      memoryCommonwealthInflationRecallGateBand: memoryRecallGate.gateBand,
      automationSynthesisInflationCascadeDriftBand: synthesisCascade.driftBand,
      uiShellInflationSalienceEscalationBand: uiSalienceEscalation.escalationBand,
      dashboardHeatmapInflationOverlayCascadeBand: heatmapOverlay.cascadeBand,
      commandCenterInflationFusionLatchBand: commandFusionLatch.latchBand,
      transportFreightInflationCongestionCascadeBand: freightCascade.cascadeBand,
      eventsStagedInflationShockPersistenceBand: eventShockPersistence.persistenceBand,
      modesSandboxInflationStressCascadeBand: sandboxStressCascade.cascadeBand,
      fiscalAppropriationInflationPressureLatchBand: appropriationLatch.latchBand,
      householdBudgetInflationStressCascadeBand: budgetStressCascade.cascadeBand,
      corporateSurvivalPricingInflationLatchBand: survivalPricing.latchBand,
      tradeTariffExchangeInflationEscalationBand: tariffExchange.escalationBand,
      metroCapacityRentInflationLatchBand: metroCapacityRent.latchBand,
      gridWholesaleTariffInflationSurgeBand: gridWholesaleTariff.surgeBand,
      guardianCopilotInflationPressureLatchBand: guardianCopilotPressure.latchBand,
      teamBriefingConsensusInflationUnmooringBand: teamBriefingUnmooring.unmooringBand,
      memoryRealmInflationPersistenceLatchBand: memoryRealmPersistence.latchBand,
      automationSynthesisInflationCascadeSurgeBand: automationCascadeSurge.surgeBand,
      uiShellInflationAttentionLatchBand: uiShellAttention.latchBand,
      dashboardRegionalInflationOverlaySurgeBand: dashboardOverlaySurge.surgeBand,
      commandCenterInflationAlertPressureLatchBand: commandAlertPressure.latchBand,
      transportFreightInflationGridlockSurgeBand: freightGridlockSurge.surgeBand,
      eventsNarrativeInflationShockLatchBand: eventsNarrativeShock.latchBand,
      modesSandboxInflationPressureSurgeBand: modesSandboxPressure.surgeBand,
      fiscalConsolidatedInflationPressureLatchBand: fiscalConsolidatedPressure.latchBand,
      householdWageInflationStressSurgeBand: householdWageStress.surgeBand,
      macroOutputGapInflationPressureLatchBand: macroOutputGapLatch.latchBand,
      corporateCapacityMarkupInflationSurgeBand: corporateCapacitySurge.surgeBand,
      researchBreakthroughSupplySideInflationLatchBand: researchBreakthroughLatch.latchBand,
      tradeImportExchangeInflationPipelineSurgeBand: tradeImportPipelineSurge.surgeBand,
      metroRegionalRentInflationEscalationLatchBand: metroRegionalRentEscalation.latchBand,
      wholesaleGridTransitionInflationSurgeBand: wholesaleGridTransitionSurge.surgeBand,
      tradeClearedForwardArcInflationHandoffLatchBand: tradeClearedForwardArcHandoff.latchBand,
      guardianEntrustmentEnvelopeInflationPressureSurgeBand: guardianEntrustmentEnvelope.surgeBand,
      housingWellbeingMortgageInflationEscalationLatchBand: housingWellbeingMortgageEscalation.latchBand,
      transportCorridorFreightInflationSurgeLatchBand: transportCorridorFreightSurge.surgeBand,
    });
  }

  return {
    points,
    terminalBand: points[points.length - 1]?.inflationBand ?? 'anchored',
    maxCostMultiplier: maxCost,
  };
}
