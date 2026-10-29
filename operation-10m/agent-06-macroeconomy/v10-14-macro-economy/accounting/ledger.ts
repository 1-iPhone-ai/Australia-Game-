import { V1014_MACRO_LIMITS } from '../constants.ts';
import { productivityIndexFromBand, v1014macroClamp } from '../math.ts';
import type { NationalAccountingLedger } from '../types.ts';

export function buildNationalAccountingLedger(params: {
  productivityScore: number;
  utilizationIndex: number;
  investmentScore: number;
  regionalSumShare: number;
}): NationalAccountingLedger {
  const productivityComponent = productivityIndexFromBand(params.productivityScore);
  const utilizationComponent = params.utilizationIndex / 100;
  const investmentComponent = params.investmentScore / 100;
  const grossOutputIndex = v1014macroClamp(
    productivityComponent * utilizationComponent * 100 * (0.92 + investmentComponent * 0.16),
    0,
    100
  );
  const identityResidual = Math.abs(params.regionalSumShare - 1);
  return {
    grossOutputIndex,
    productivityComponent,
    utilizationComponent,
    investmentComponent,
    regionalSumShare: params.regionalSumShare,
    identityResidual,
    identityOk: identityResidual <= V1014_MACRO_LIMITS.accountingTolerance,
    provenance: ['v1014_macro_accounting_identity_v1', 'agent06_modular_reconcile']
  };
}

export function reconcileAccountingLedger(ledger: NationalAccountingLedger): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!ledger.identityOk) {
    issues.push(`share identity residual ${ledger.identityResidual}`);
  }
  const recomputed = v1014macroClamp(
    ledger.productivityComponent *
      ledger.utilizationComponent *
      100 *
      (0.92 + ledger.investmentComponent * 0.16),
    0,
    100
  );
  if (Math.abs(recomputed - ledger.grossOutputIndex) > 0.05) {
    issues.push(`output index drift recomputed=${recomputed.toFixed(3)} ledger=${ledger.grossOutputIndex.toFixed(3)}`);
  }
  if (ledger.regionalSumShare < 0.99999 || ledger.regionalSumShare > 1.00001) {
    issues.push(`regionalSumShare=${ledger.regionalSumShare}`);
  }
  return { ok: issues.length === 0, issues };
}
