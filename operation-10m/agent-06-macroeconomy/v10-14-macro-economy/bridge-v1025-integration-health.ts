import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroIntegrationHealthSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.25 cross-system integration health spillover (Agent 25 domain). */
export function readMacroIntegrationHealthSpilloverFromV1025(inputs: MacroEconomyInputs): MacroIntegrationHealthSpillover {
  const ih: any =
    inputs.integrationHealth ??
    inputs.op10mIntegration?.health ??
    inputs.nationalSystems?.integrationHealth ??
    inputs.assemblyHealth;
  if (!ih) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const mesh = String(ih.meshBand ?? ih.syncBand ?? ih.crossSystemBand ?? '');
  const drift = String(ih.contractDriftBand ?? ih.schemaDrift?.band ?? '');
  const smoke = String(ih.smokeBand ?? ih.smokeTest?.band ?? '');

  if (mesh === 'fractured' || mesh === 'critical' || mesh === 'desynced') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Fractured integration mesh (${mesh}) weakens macro cycle confidence read.`;
  } else if (mesh === 'healthy' || mesh === 'tight') {
    productivityNudge += 0.5;
    cycleNudge += 0.5;
    summary = `Healthy integration mesh (${mesh}) supports macro productivity interpretation.`;
  }

  if (drift === 'runaway' || drift === 'severe' || drift === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Runaway contract drift distorts macro spillover aggregation.';
  }

  if (smoke === 'failing' || smoke === 'critical' || smoke === 'red') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Failing integration smoke checks drag macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroIntegrationHealthSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIntegrationHealthSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
