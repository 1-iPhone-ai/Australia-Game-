/**
 * Structural boundary rules — mirrors SECTION 20AJ invariants.
 */

export const V1014_LABOR_FORBIDDEN_STATE_KEYS = [
  'population',
  'unemploymentRate',
  'workerAgents',
  'payrollCost',
  'wageBill',
  'migrationQuota'
] as const;

export const V1014_LABOR_BOUNDARY_RULES: readonly { id: string; rule: string }[] = [
  {
    id: 'no_population_counts',
    rule: 'Never persist literal population, unemployment %, payroll, or migration quota figures — only bands and 0..100 indices.'
  },
  {
    id: 'v101_industry_output',
    rule: 'V10.1 effectiveOutput remains authoritative for employment linkage; V10.14 interprets only.'
  },
  {
    id: 'v1010_workforce',
    rule: 'V10.10 workforce pressure and automation shift remain authoritative; V10.14 reads strain for wages and automation feedback.'
  },
  {
    id: 'v1013_households',
    rule: 'V10.13 household employment opportunity informs fit scores but is never overwritten here.'
  },
  {
    id: 'no_wallets',
    rule: 'Labor demographics never mutates player cash, AP, or commodity prices.'
  }
] as const;

export function summarizeLaborBoundariesForGi(): string[] {
  return V1014_LABOR_BOUNDARY_RULES.map(r => r.rule);
}
