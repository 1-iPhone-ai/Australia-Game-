import type { AppropriationLineItem } from './types';

/** Federal appropriation structure (normalized points, not AUD). */
export const APPROPRIATION_LINE_CATALOG: AppropriationLineItem[] = [
  {
    id: 'cs_health_admin',
    category: 'core_services',
    tier: 'department',
    code: 'CS-010',
    title: 'Health portfolio administration',
    description: 'Departmental operating for national health policy coordination.',
    weight: 0.18,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_social_services',
    category: 'core_services',
    tier: 'department',
    code: 'CS-020',
    title: 'Social services delivery support',
    description: 'Platform costs for services payment integrity and compliance.',
    weight: 0.22,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_treasury_ops',
    category: 'core_services',
    tier: 'program',
    code: 'CS-030',
    title: 'Treasury & fiscal operations',
    description: 'Budget execution, appropriation management, fiscal reporting.',
    weight: 0.15,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_digital_gov',
    category: 'core_services',
    tier: 'measure',
    code: 'CS-040',
    title: 'Digital government shared services',
    description: 'Whole-of-government platforms; amortized operating charge.',
    weight: 0.12,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_other_admin',
    category: 'core_services',
    tier: 'program',
    code: 'CS-090',
    title: 'Residual administration',
    description: 'Cross-portfolio admin not allocated to specific measures.',
    weight: 0.33,
    recurring: true,
    capital: false
  },
  {
    id: 'ic_transport_corridor',
    category: 'infrastructure_capital',
    tier: 'program',
    code: 'IC-110',
    title: 'National transport corridor capital',
    description: 'Rail and highway packages with multi-year profiles.',
    weight: 0.35,
    recurring: false,
    capital: true
  },
  {
    id: 'ic_energy_transition',
    category: 'infrastructure_capital',
    tier: 'program',
    code: 'IC-120',
    title: 'Energy transition infrastructure',
    description: 'Grid, storage, and connection assets (capital).',
    weight: 0.25,
    recurring: false,
    capital: true
  },
  {
    id: 'ic_water_security',
    category: 'infrastructure_capital',
    tier: 'measure',
    code: 'IC-130',
    title: 'Water security capital',
    description: 'Dams, pipelines, and basin projects.',
    weight: 0.2,
    recurring: false,
    capital: true
  },
  {
    id: 'ic_regional_alloc',
    category: 'infrastructure_capital',
    tier: 'measure',
    code: 'IC-140',
    title: 'Regional infrastructure allocation',
    description: 'State-identified priority capital with federal co-funding rules.',
    weight: 0.2,
    recurring: false,
    capital: true
  },
  {
    id: 'mb_road_network',
    category: 'maintenance_backlog',
    tier: 'program',
    code: 'MB-210',
    title: 'National road network maintenance',
    description: 'Pavement, bridges, and safety remediation backlog.',
    weight: 0.4,
    recurring: true,
    capital: false
  },
  {
    id: 'mb_rail_network',
    category: 'maintenance_backlog',
    tier: 'program',
    code: 'MB-220',
    title: 'Rail network upkeep',
    description: 'Track, signalling, and rolling stock lifecycle maintenance.',
    weight: 0.35,
    recurring: true,
    capital: false
  },
  {
    id: 'mb_public_housing',
    category: 'maintenance_backlog',
    tier: 'measure',
    code: 'MB-230',
    title: 'Public housing maintenance',
    description: 'Stock remediation tied to V10.14 services delivery.',
    weight: 0.25,
    recurring: true,
    capital: false
  },
  {
    id: 'ri_research_council',
    category: 'research_innovation',
    tier: 'program',
    code: 'RI-310',
    title: 'Research councils & competitive grants',
    description: 'Discovery and linkage programs (accrual profile).',
    weight: 0.55,
    recurring: true,
    capital: false
  },
  {
    id: 'ri_innovation_agency',
    category: 'research_innovation',
    tier: 'program',
    code: 'RI-320',
    title: 'Innovation commercialization agency',
    description: 'Translation, industry collaboration, startup support.',
    weight: 0.45,
    recurring: true,
    capital: false
  },
  {
    id: 'rd_regional_growth',
    category: 'regional_development',
    tier: 'program',
    code: 'RD-410',
    title: 'Regional growth packages',
    description: 'Place-based investment outside capital cities.',
    weight: 0.5,
    recurring: true,
    capital: false
  },
  {
    id: 'rd_remote_services',
    category: 'regional_development',
    tier: 'measure',
    code: 'RD-420',
    title: 'Remote & Indigenous community services',
    description: 'Service delivery load in remote jurisdictions.',
    weight: 0.5,
    recurring: true,
    capital: false
  },
  {
    id: 'rr_disaster_recovery',
    category: 'resilience_recovery',
    tier: 'program',
    code: 'RR-510',
    title: 'Disaster recovery funding',
    description: 'Event-driven recovery; contingent appropriation drawdown.',
    weight: 0.6,
    recurring: false,
    capital: false
  },
  {
    id: 'rr_resilience_fund',
    category: 'resilience_recovery',
    tier: 'measure',
    code: 'RR-520',
    title: 'National resilience fund',
    description: 'Mitigation and preparedness baseline.',
    weight: 0.4,
    recurring: true,
    capital: false
  },
  {
    id: 'ds_coupon_service',
    category: 'debt_service_reserve',
    tier: 'program',
    code: 'DS-610',
    title: 'Sovereign coupon & interest',
    description: 'Debt service on issued securities (non-discretionary).',
    weight: 0.7,
    recurring: true,
    capital: false
  },
  {
    id: 'ds_liquidity_buffer',
    category: 'debt_service_reserve',
    tier: 'measure',
    code: 'DS-620',
    title: 'Fiscal liquidity buffer',
    description: 'Cash management and short-term facility costs.',
    weight: 0.3,
    recurring: true,
    capital: false
  },
  {
    id: 'ct_unallocated',
    category: 'contingency',
    tier: 'measure',
    code: 'CT-710',
    title: 'Unallocated contingency',
    description: 'Held for mid-year estimates and unforeseen pressures.',
    weight: 0.65,
    recurring: false,
    capital: false
  },
  {
    id: 'ct_economic_risk',
    category: 'contingency',
    tier: 'measure',
    code: 'CT-720',
    title: 'Economic risk reserve',
    description: 'Macro shock buffer (draw rules tied to fiscal resilience layer).',
    weight: 0.35,
    recurring: false,
    capital: false
  }
];

export function linesForCategory(category: AppropriationLineItem['category']): AppropriationLineItem[] {
  return APPROPRIATION_LINE_CATALOG.filter(l => l.category === category);
}

export function normalizedWeights(category: AppropriationLineItem['category']): Map<string, number> {
  const items = linesForCategory(category);
  const sum = items.reduce((s, i) => s + i.weight, 0) || 1;
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.id, item.weight / sum);
  }
  return map;
}
