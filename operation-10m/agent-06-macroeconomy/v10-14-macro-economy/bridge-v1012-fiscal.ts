import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroFiscalSpillover {
  investmentNudge: number;
  cycleNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.12 fiscal spillover into macro scores (warn-only cross-check; never mutates treasury). */
export function readMacroFiscalSpilloverFromV1012(inputs: MacroEconomyInputs): MacroFiscalSpillover {
  const pf: any = inputs.publicFinance;
  if (!pf) {
    return { investmentNudge: 0, cycleNudge: 0, productivityNudge: 0, summary: null };
  }
  const pressure = String(pf.pressure ?? pf.fiscalPosition?.pressure ?? pf.fiscalPressure ?? 'healthy');
  const headroom = Number(pf.fiscalHeadroom ?? pf.fiscalPosition?.fiscalHeadroom ?? 0);
  let investmentNudge = 0;
  let cycleNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (pressure === 'critical' || pressure === 'strained') {
    investmentNudge -= pressure === 'critical' ? 4 : 2;
    cycleNudge -= 2;
    summary = `Public fiscal pressure (${pressure}) tightens macro investment climate read-only.`;
  } else if (pressure === 'healthy' && headroom > 6) {
    investmentNudge += 1;
    summary = 'Comfortable fiscal headroom supports macro investment climate (interpretation only).';
  }
  if (headroom < -4) {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Negative fiscal headroom weighs on cycle momentum.';
  }

  return {
    investmentNudge: v1014macroClamp(investmentNudge, -8, 4),
    cycleNudge: v1014macroClamp(cycleNudge, -6, 4),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 2),
    summary
  };
}

export function applyMacroFiscalSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroFiscalSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
