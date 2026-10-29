/**
 * Agent 21 — domain stress matrix (catalog-driven cross-domain lab grid).
 */

import { evaluateAg21ForecastRun } from './forecast-evaluation-metrics';
import { ag21LabelUncertainty, type Ag21UncertaintyBand } from './isolation-core';
import { AG21_FORECAST_SCENARIO_CATALOG, lookupAg21Scenario } from './scenario-catalog';

export interface Ag21DomainStressCell {
  domain: string;
  scenarioId: string;
  title: string;
  stressIndex: number;
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21DomainStressMatrix {
  domains: string[];
  cells: Ag21DomainStressCell[];
  matrixScore: number;
  hotspots: string[];
  evaluationGrade: ReturnType<typeof evaluateAg21ForecastRun>['grade'];
  headline: string;
  authoritative: false;
}

const AG21_DOMAIN_ORDER = ['balance', 'fiscal', 'workforce', 'capital', 'resilience', 'national_priority'] as const;

const AG21_UNCERTAINTY_WEIGHT: Record<Ag21UncertaintyBand, number> = {
  low: 0.15,
  moderate: 0.35,
  high: 0.65,
  speculative: 0.9
};

function ag21PickScenarioForDomain(domain: string, offset: number): Ag21DomainStressCell | null {
  const pool = AG21_FORECAST_SCENARIO_CATALOG.filter(s => s.domain === domain);
  if (!pool.length) return null;
  const entry = pool[offset % pool.length];
  const stressIndex = AG21_UNCERTAINTY_WEIGHT[entry.defaultUncertainty] + (offset % 3) * 0.05;
  return {
    domain,
    scenarioId: entry.id,
    title: entry.title,
    stressIndex: Math.min(1, stressIndex),
    uncertainty: entry.defaultUncertainty
  };
}

/** Build a fixed cross-domain stress matrix using catalog entries (read-only). */
export function buildAg21DomainStressMatrix(samplePerDomain = 2): Ag21DomainStressMatrix {
  const cells: Ag21DomainStressCell[] = [];
  const domains: string[] = [];

  for (const domain of AG21_DOMAIN_ORDER) {
    let added = 0;
    for (let i = 0; i < samplePerDomain; i++) {
      const cell = ag21PickScenarioForDomain(domain, i);
      if (!cell) continue;
      cells.push(cell);
      added++;
    }
    if (added) domains.push(domain);
  }

  const scenarios = cells.map(c => lookupAg21Scenario(c.scenarioId)).filter(Boolean) as NonNullable<
    ReturnType<typeof lookupAg21Scenario>
  >[];

  const evaluation = evaluateAg21ForecastRun({
    scenarioIds: scenarios.map(s => s.id),
    scenarios,
    experimentCount: 4,
    overallUncertainty: 'moderate',
    authoritativeMutationDetected: false,
    isolatedCopyVerifiedRatio: 1
  });

  const matrixScore =
    cells.reduce((sum, c) => sum + c.stressIndex, 0) / Math.max(1, cells.length);

  const hotspots = cells
    .filter(c => c.stressIndex >= 0.6)
    .sort((a, b) => b.stressIndex - a.stressIndex)
    .slice(0, 4)
    .map(c => `${c.domain}:${c.scenarioId}`);

  return {
    domains,
    cells,
    matrixScore,
    hotspots,
    evaluationGrade: evaluation.grade,
    headline: ag21LabelUncertainty(
      matrixScore > 0.65 ? 'high' : matrixScore > 0.4 ? 'moderate' : 'low',
      [`domains=${domains.length}`, `cells=${cells.length}`]
    ).headline,
    authoritative: false
  };
}

export function runAg21DomainStressMatrixSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const matrix = buildAg21DomainStressMatrix(2);
  push('domain_matrix_cells', matrix.cells.length >= 10, String(matrix.cells.length));
  push('domain_matrix_domains', matrix.domains.length >= 5, String(matrix.domains.length));
  push('domain_matrix_non_auth', matrix.authoritative === false, 'flag');
  push('domain_matrix_score', matrix.matrixScore > 0 && matrix.matrixScore <= 1, String(matrix.matrixScore));

  return out;
}
