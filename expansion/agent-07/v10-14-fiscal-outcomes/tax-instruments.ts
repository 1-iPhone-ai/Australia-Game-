import type { TaxInstrumentDefinition } from './types';

/** Core national tax instrument catalog (Agent 07 authored). */
export const TAX_INSTRUMENT_CATALOG: Record<string, TaxInstrumentDefinition> = {
  corp_standard: {
    id: 'corp_standard',
    kind: 'corporate_rate',
    label: 'Company Tax Rate',
    description:
      'Broad corporate income tax. Raises revenue with moderate investment sensitivity; cuts can stimulate capital spending but reduce headroom.',
    revenueElasticity: 0.85,
    householdSensitivity: 0.05,
    investmentSensitivity: 0.55,
    stabilitySensitivity: 0.15,
    minRatePoints: 18,
    maxRatePoints: 35,
    defaultRatePoints: 25
  },
  personal_progressive: {
    id: 'personal_progressive',
    kind: 'personal_rate',
    label: 'Personal Income Tax (progressive midpoint)',
    description:
      'Household-facing income tax wedge (modeled as midpoint rate). Strong revenue link; higher rates ease fiscal pressure but weigh on affordability.',
    revenueElasticity: 0.75,
    householdSensitivity: 0.7,
    investmentSensitivity: 0.2,
    stabilitySensitivity: 0.35,
    minRatePoints: 19,
    maxRatePoints: 42,
    defaultRatePoints: 30
  },
  payroll_levy: {
    id: 'payroll_levy',
    kind: 'payroll_levy',
    label: 'Payroll & Medicare Levy Bundle',
    description: 'Employment-linked levies funding services. Moderate revenue; affects workforce participation signals via V10.10 spillovers.',
    revenueElasticity: 0.55,
    householdSensitivity: 0.45,
    investmentSensitivity: 0.35,
    stabilitySensitivity: 0.25,
    minRatePoints: 2,
    maxRatePoints: 12,
    defaultRatePoints: 5
  },
  resource_rent: {
    id: 'resource_rent',
    kind: 'resource_rent',
    label: 'Resource Rent & PRRT-style Uplift',
    description: 'Captures resource super-profits; volatile with commodity cycles (feeds revenue volatility, not CPI).',
    revenueElasticity: 0.95,
    householdSensitivity: 0.02,
    investmentSensitivity: 0.4,
    stabilitySensitivity: 0.2,
    minRatePoints: 0,
    maxRatePoints: 40,
    defaultRatePoints: 22
  },
  carbon_price: {
    id: 'carbon_price',
    kind: 'carbon_price',
    label: 'Carbon Price & Safeguard Mechanism',
    description: 'Pricing emissions-intensive activity. Revenue plus transition pressure on energy-intensive regions.',
    revenueElasticity: 0.5,
    householdSensitivity: 0.35,
    investmentSensitivity: 0.45,
    stabilitySensitivity: 0.3,
    minRatePoints: 0,
    maxRatePoints: 80,
    defaultRatePoints: 24
  },
  gst_equivalent: {
    id: 'gst_equivalent',
    kind: 'gst_equivalent',
    label: 'Consumption Tax (GST-equivalent)',
    description: 'Broad consumption base. Stable revenue; regressive affordability footprint unless offset.',
    revenueElasticity: 0.8,
    householdSensitivity: 0.55,
    investmentSensitivity: 0.1,
    stabilitySensitivity: 0.2,
    minRatePoints: 8,
    maxRatePoints: 15,
    defaultRatePoints: 10
  },
  land_value_uplift: {
    id: 'land_value_uplift',
    kind: 'land_value_uplift',
    label: 'Land Value & Development Uplift Share',
    description: 'Captures a share of land value uplift from infrastructure. Supports capital programs; politically sensitive.',
    revenueElasticity: 0.35,
    householdSensitivity: 0.25,
    investmentSensitivity: 0.15,
    stabilitySensitivity: 0.4,
    minRatePoints: 0,
    maxRatePoints: 25,
    defaultRatePoints: 8
  },
  innovation_credit: {
    id: 'innovation_credit',
    kind: 'innovation_credit',
    label: 'R&D & Innovation Tax Incentive',
    description: 'Negative-rate instrument (credit). Reduces near-term revenue; boosts innovation momentum outcomes when sustained.',
    revenueElasticity: -0.4,
    householdSensitivity: 0.05,
    investmentSensitivity: -0.35,
    stabilitySensitivity: 0.05,
    minRatePoints: -15,
    maxRatePoints: 5,
    defaultRatePoints: -8
  },
  regional_incentive: {
    id: 'regional_incentive',
    kind: 'regional_incentive',
    label: 'Regional Investment Incentive',
    description: 'Targeted concessions for lagging regions. Revenue cost with regional balance upside.',
    revenueElasticity: -0.25,
    householdSensitivity: 0.15,
    investmentSensitivity: -0.2,
    stabilitySensitivity: 0.15,
    minRatePoints: -12,
    maxRatePoints: 8,
    defaultRatePoints: -4
  }
};

export const DEFAULT_TAX_INSTRUMENT_IDS = Object.keys(TAX_INSTRUMENT_CATALOG);

export function clampRate(def: TaxInstrumentDefinition, rate: number): number {
  return Math.min(def.maxRatePoints, Math.max(def.minRatePoints, Math.round(rate * 10) / 10));
}

export function estimateRevenueDelta(
  def: TaxInstrumentDefinition,
  ratePoints: number,
  structuralCapacity: number
): number {
  const deltaFromDefault = ratePoints - def.defaultRatePoints;
  const raw = (deltaFromDefault / 10) * def.revenueElasticity * (structuralCapacity / 100) * 8;
  return Math.round(raw * 10) / 10;
}
