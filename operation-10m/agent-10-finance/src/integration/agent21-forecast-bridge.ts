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
import { finRound } from '../compute/math.js';

/** Contract surface for Agent 21 forecasting fusion (read-only bundle). */
export interface Agent21InflationForecastBundle {
  schemaVersion: '10.14.agent10.r16';
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
    schemaVersion: '10.14.agent10.r16',
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
