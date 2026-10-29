import type { TaxExpenditureMeasure } from '../types';

export const TAX_EXPENDITURE_CATALOG: TaxExpenditureMeasure[] = [
  {
    id: 'te_super_concession',
    code: 'TE-101',
    title: 'Superannuation contribution concessions',
    category: 'preferential_rate',
    linkedInstrumentKind: 'personal_rate',
    structuralForgonePoints: 6.5,
    householdShare: 0.85,
    sunsetTurn: null,
    description: 'Concessional tax treatment of mandated retirement savings.'
  },
  {
    id: 'te_rd_credit',
    code: 'TE-110',
    title: 'R&D tax incentive gross-up',
    category: 'credit_offset',
    linkedInstrumentKind: 'innovation_credit',
    structuralForgonePoints: 4.2,
    householdShare: 0.05,
    sunsetTurn: null,
    description: 'Refundable/non-refundable components modeled as revenue forgone.'
  },
  {
    id: 'te_cgt_discount',
    code: 'TE-120',
    title: 'Capital gains discount',
    category: 'concession',
    linkedInstrumentKind: 'personal_rate',
    structuralForgonePoints: 3.8,
    householdShare: 0.55,
    sunsetTurn: null,
    description: 'Individual and trust capital gains discount.'
  },
  {
    id: 'te_fbt_exempt',
    code: 'TE-130',
    title: 'FBT exempt entities & benefits',
    category: 'exemption',
    linkedInstrumentKind: 'payroll_levy',
    structuralForgonePoints: 2.1,
    householdShare: 0.4,
    sunsetTurn: null,
    description: 'Health, charity, and public benevolent institution exemptions.'
  },
  {
    id: 'te_fuel_credit',
    code: 'TE-140',
    title: 'Fuel tax credits (business)',
    category: 'credit_offset',
    linkedInstrumentKind: 'gst_equivalent',
    structuralForgonePoints: 2.9,
    householdShare: 0.02,
    sunsetTurn: null,
    description: 'Off-road and heavy vehicle fuel tax credits.'
  },
  {
    id: 'te_small_business',
    code: 'TE-150',
    title: 'Small business instant asset write-off',
    category: 'deferral',
    linkedInstrumentKind: 'corporate_rate',
    structuralForgonePoints: 1.8,
    householdShare: 0.15,
    sunsetTurn: null,
    description: 'Timing difference on eligible asset deductions.'
  },
  {
    id: 'te_regional_zones',
    code: 'TE-160',
    title: 'Regional tax zone offsets',
    category: 'concession',
    linkedInstrumentKind: 'regional_incentive',
    structuralForgonePoints: 1.2,
    householdShare: 0.65,
    sunsetTurn: null,
    description: 'Remote area and zone-based offsets.'
  },
  {
    id: 'te_carbon_free_alloc',
    code: 'TE-170',
    title: 'Emissions-intensive trade-exposed allocations',
    category: 'exemption',
    linkedInstrumentKind: 'carbon_price',
    structuralForgonePoints: 2.4,
    householdShare: 0.1,
    sunsetTurn: null,
    description: 'Safeguard free allocations and trade exposure relief.'
  },
  {
    id: 'te_resource_exploration',
    code: 'TE-180',
    title: 'Mineral exploration deduction flow-through',
    category: 'deferral',
    linkedInstrumentKind: 'resource_rent',
    structuralForgonePoints: 1.5,
    householdShare: 0.02,
    sunsetTurn: null,
    description: 'Exploration incentive timing benefits.'
  },
  {
    id: 'te_phantom_sunset',
    code: 'TE-199',
    title: 'Legacy sunset measure (review)',
    category: 'concession',
    linkedInstrumentKind: null,
    structuralForgonePoints: 0.6,
    householdShare: 0.2,
    sunsetTurn: 12,
    description: 'Placeholder for lapsed measure under parliamentary review.'
  }
];
