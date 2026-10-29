import { V1014_MACRO_LIMITS } from '../constants.ts';
import { sumRegionalShares } from '../regional-aggregation.ts';
import type { NationalMacroEconomyState } from '../types.ts';

export function validateNationalMacroEconomyState(st: NationalMacroEconomyState | null | undefined): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!st) return { valid: false, issues: ['null state'] };
  if (!st.accounting.identityOk) issues.push(`accounting identity residual ${st.accounting.identityResidual}`);
  const sum = sumRegionalShares(st.regionalContributions);
  if (Math.abs(sum - 1) > V1014_MACRO_LIMITS.accountingTolerance) issues.push(`regional share sum ${sum}`);
  return { valid: issues.length === 0, issues };
}
