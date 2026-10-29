import { V1014_MACRO_CORE_REGIONS, V1014_MACRO_LIMITS, V1014_MACRO_REGION_BASE_WEIGHT } from './constants.ts';
import { regionalInvestmentIntensity } from './investment.ts';
import {
  averageRegionalProductivityIndex,
  v1014macroComposeSectorProductivity
} from './productivity.ts';
import { regionalUtilizationIndex } from './production.ts';
import type {
  MacroEconomyEvidence,
  MacroEconomyInputs,
  RegionalContributionRole,
  RegionalMacroContribution
} from './types.ts';

export function v1014macroNormalizeRegionalShares(
  raw: Array<{ regionId: string; weight: number }>
): Record<string, number> {
  const out: Record<string, number> = {};
  let total = 0;
  for (const row of raw) {
    const w = Math.max(0, Number(row.weight) || 0);
    out[row.regionId] = w;
    total += w;
  }
  if (total <= 0) {
    for (const code of V1014_MACRO_CORE_REGIONS) out[code] = V1014_MACRO_REGION_BASE_WEIGHT[code] ?? 0.125;
    total = Object.values(out).reduce((a, b) => a + b, 0);
  }
  for (const k of Object.keys(out)) out[k] = out[k] / total;
  return out;
}

export function computeRegionalWeightRows(
  inputs: MacroEconomyInputs,
  pushEv: (factor: string, contribution: number, sourceSystem: string, sourceId: string, regionIds?: string[]) => void
): Array<{ regionId: string; weight: number }> {
  const lr: any = inputs.livingRegions;
  const weights: Array<{ regionId: string; weight: number }> = [];
  for (const code of V1014_MACRO_CORE_REGIONS) {
    const lrReg = lr?.regions?.[code];
    const ex = inputs.regions?.[code];
    const econ = Number(ex?.economyScore ?? lrReg?.economy?.score ?? 55);
    const mom = String(ex?.momentumBand ?? lrReg?.momentum?.band ?? 'stable');
    const dev = Number(ex?.developmentScore ?? lrReg?.development?.score ?? 50);
    let w = (V1014_MACRO_REGION_BASE_WEIGHT[code] ?? 0.125) * (0.55 + econ / 200 + dev / 400);
    if (mom === 'surging') w *= 1.08;
    if (mom === 'declining') w *= 0.92;
    weights.push({ regionId: code, weight: w });
    pushEv('regional_economy', econ / 100, 'living_regions', code, [code]);
  }
  return weights;
}

function resolveRegionalRole(
  share: number,
  momentumBand: string | undefined
): RegionalContributionRole {
  let role: RegionalContributionRole = 'balanced';
  if (share >= 0.22) role = 'anchor';
  else if (share >= 0.14) role = 'driver';
  else if (share < 0.03) role = 'lagging';
  if (momentumBand === 'volatile') role = 'volatile';
  return role;
}

export function buildRegionalContributions(params: {
  inputs: MacroEconomyInputs;
  shares: Record<string, number>;
  investmentScore: number;
  utilizationIndex: number;
  evidence: MacroEconomyEvidence[];
}): RegionalMacroContribution[] {
  const lr: any = params.inputs.livingRegions;
  return V1014_MACRO_CORE_REGIONS.map(code => {
    const share = params.shares[code] ?? 0;
    const lrReg = lr?.regions?.[code];
    const prod = v1014macroComposeSectorProductivity(code);
    const productivityIndex = averageRegionalProductivityIndex(prod);
    const investmentIntensity = regionalInvestmentIntensity(params.investmentScore, share);
    const utilizationIndexR = regionalUtilizationIndex(params.utilizationIndex, share);
    const role = resolveRegionalRole(share, lrReg?.momentum?.band);
    const primarySector = Object.entries(prod).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'services';
    return {
      regionId: code,
      share,
      role,
      productivityIndex,
      investmentIntensity,
      utilizationIndex: utilizationIndexR,
      primarySector,
      contributionTags: [role, primarySector],
      evidence: params.evidence.filter(e => e.regionIds.includes(code)).slice(0, V1014_MACRO_LIMITS.maxEvidence)
    };
  });
}

export function sumRegionalShares(contributions: RegionalMacroContribution[]): number {
  return contributions.reduce((a, r) => a + r.share, 0);
}
