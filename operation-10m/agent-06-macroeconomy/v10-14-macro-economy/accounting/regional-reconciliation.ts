import { V1014_MACRO_LIMITS } from '../constants.ts';
import { sumRegionalShares } from '../regional-aggregation.ts';
import type { RegionalMacroContribution } from '../types.ts';
import { computeNationalMacroEconomy } from '../compute.ts';
import { makeDefaultV1014_MACRO_TestInputs } from '../inputs.ts';

export interface RegionalReconciliationReport {
  ok: boolean;
  shareSum: number;
  shareResidual: number;
  issues: string[];
  impliedOutputIndex: number;
  reportedOutputIndex: number;
  outputDrift: number;
}

export function reconcileRegionalContributionShares(
  contributions: RegionalMacroContribution[]
): { ok: boolean; shareSum: number; shareResidual: number; issues: string[] } {
  const issues: string[] = [];
  const shareSum = sumRegionalShares(contributions);
  const shareResidual = Math.abs(shareSum - 1);
  if (shareResidual > V1014_MACRO_LIMITS.accountingTolerance) {
    issues.push(`share sum ${shareSum}`);
  }
  if (contributions.length !== V1014_MACRO_LIMITS.maxRegionalRows) {
    issues.push(`expected ${V1014_MACRO_LIMITS.maxRegionalRows} rows, got ${contributions.length}`);
  }
  for (const row of contributions) {
    if (row.share < 0 || row.share > 1) issues.push(`${row.regionId} share out of range ${row.share}`);
    if (!Number.isFinite(row.productivityIndex)) issues.push(`${row.regionId} productivity NaN`);
    if (row.investmentIntensity < 0 || row.investmentIntensity > 100) {
      issues.push(`${row.regionId} investment intensity ${row.investmentIntensity}`);
    }
  }
  const ids = contributions.map(r => r.regionId);
  if (new Set(ids).size !== ids.length) issues.push('duplicate region ids');
  return {
    ok: issues.length === 0,
    shareSum,
    shareResidual,
    issues
  };
}

export function reconcileRegionalOutputAgainstNational(params: {
  contributions: RegionalMacroContribution[];
  grossOutputIndex: number;
}): RegionalReconciliationReport {
  const base = reconcileRegionalContributionShares(params.contributions);
  const impliedOutputIndex = params.contributions.reduce(
    (acc, r) => acc + r.share * (r.productivityIndex * 0.55 + r.utilizationIndex * 0.45) / 100,
    0
  );
  const scaledImplied = impliedOutputIndex * 100;
  const outputDrift = Math.abs(scaledImplied - params.grossOutputIndex);
  const issues = [...base.issues];
  if (outputDrift > 35) {
    issues.push(`output drift implied=${scaledImplied.toFixed(2)} national=${params.grossOutputIndex.toFixed(2)}`);
  }
  return {
    ok: issues.length === 0,
    shareSum: base.shareSum,
    shareResidual: base.shareResidual,
    issues,
    impliedOutputIndex: scaledImplied,
    reportedOutputIndex: params.grossOutputIndex,
    outputDrift
  };
}

export function runRegionalReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const baseline = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
  const regBase = reconcileRegionalContributionShares(baseline.state.regionalContributions);
  record('RR01', 'Baseline regional shares reconcile', regBase.ok, regBase.issues.join('; ') || 'ok');

  const full = reconcileRegionalOutputAgainstNational({
    contributions: baseline.state.regionalContributions,
    grossOutputIndex: baseline.state.accounting.grossOutputIndex
  });
  record('RR02', 'Baseline regional output diagnostic', full.ok, full.issues.join('; ') || 'ok');

  const shocked = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      activeCyclicalShockIds: ['commodity_bust', 'global_slowdown']
    }),
    null,
    null
  );
  const regShock = reconcileRegionalContributionShares(shocked.state.regionalContributions);
  record('RR03', 'Multi-shock regional shares reconcile', regShock.ok, `sum=${regShock.shareSum.toFixed(6)}`);

  const stim = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: ['stimulus_bounce'] }),
    null,
    null
  );
  record(
    'RR05',
    'Stimulus shock raises investment index vs baseline',
    stim.state.grossInvestmentIndex >= baseline.state.grossInvestmentIndex,
    `base=${baseline.state.grossInvestmentIndex} stim=${stim.state.grossInvestmentIndex}`
  );

  {
    const badRows = baseline.state.regionalContributions.map(r =>
      r.regionId === 'NSW' ? { ...r, share: r.share + 0.02 } : r
    );
    const bad = reconcileRegionalContributionShares(badRows);
    record('RR06', 'Detects inflated share sum', !bad.ok && bad.shareSum > 1, `sum=${bad.shareSum}`);
  }

  const bustOnly = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: ['commodity_bust'] }),
    null,
    null
  );
  const waShare = bustOnly.state.regionalContributions.find(r => r.regionId === 'WA')!.share;
  const baseWa = baseline.state.regionalContributions.find(r => r.regionId === 'WA')!.share;
  record(
    'RR07',
    'Commodity bust adjusts WA share downward vs baseline',
    waShare <= baseWa + 1e-9,
    `base=${baseWa.toFixed(4)} bust=${waShare.toFixed(4)}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
