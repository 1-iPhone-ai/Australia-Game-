import { macroEconomyActionAlignment } from './action-alignment.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { macroStressScenarioShockIds, MACRO_STRESS_SCENARIO_CATALOG } from './catalog/stress-scenarios.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { computeRegionalDivergenceSnapshot } from './regional-divergence.ts';
import { projectMacroEconomyOutlook } from './outlook-projection.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round2SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const base = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
  const div = computeRegionalDivergenceSnapshot(base.state.regionalContributions);
  record('R2-01', 'Regional divergence snapshot populated', div.leadingRegionId.length >= 2, div.band);

  record(
    'R2-02',
    'State carries regional divergence',
    base.state.regionalDivergence.shareHerfindahl > 0,
    String(base.state.regionalDivergence.shareHerfindahl)
  );

  const outlook = projectMacroEconomyOutlook(base.state, makeDefaultV1014_MACRO_TestInputs(), 3);
  record(
    'R2-03',
    'Outlook projection bounded confidence',
    outlook.confidence >= 0.45 && outlook.confidence <= 0.95,
    String(outlook.confidence)
  );

  record(
    'R2-04',
    'State carries outlook projection',
    base.state.outlookProjection.horizonTurns === 3,
    String(base.state.outlookProjection.projectedOutputIndex)
  );

  const stressed = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: macroStressScenarioShockIds('resource_bust') }),
    null,
    null
  );
  record(
    'R2-05',
    'Stress scenario lowers investment vs baseline',
    stressed.state.grossInvestmentIndex <= base.state.grossInvestmentIndex,
    `${base.state.grossInvestmentIndex}->${stressed.state.grossInvestmentIndex}`
  );

  const align = macroEconomyActionAlignment(base.state, { category: 'investments', regionId: 'NSW' });
  record('R2-06', 'Action alignment bounded', Boolean(align && align.scoreDelta >= -6 && align.scoreDelta <= 6), String(align?.scoreDelta));

  record(
    'R2-07',
    'Stress catalog entries have shock lists',
    MACRO_STRESS_SCENARIO_CATALOG.every(s => s.shockIds.length > 0),
    String(MACRO_STRESS_SCENARIO_CATALOG.length)
  );

  const stimOutlook = projectMacroEconomyOutlook(
    base.state,
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: macroStressScenarioShockIds('policy_recovery') }),
    2
  );
  record(
    'R2-08',
    'Recovery scenario outlook output >= baseline outlook',
    stimOutlook.projectedOutputIndex >= base.state.outlookProjection.projectedOutputIndex - 5,
    String(stimOutlook.projectedOutputIndex)
  );

  record(
    'R2-09',
    'Wide spread increases under commodity bust',
    computeRegionalDivergenceSnapshot(stressed.state.regionalContributions).productivitySpread >= div.productivitySpread - 0.01,
    stressed.state.regionalDivergence.band
  );

  const austerity = macroEconomyActionAlignment(stressed.state, { category: 'austerity' });
  record('R2-10', 'Austerity alignment negative under stress', Boolean(austerity && austerity.scoreDelta <= 0), String(austerity?.scoreDelta));

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
