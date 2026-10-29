import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroArchiveIntegritySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history archive integrity spillover (Agent 24 domain; distinct from replay/timeline). */
export function readMacroArchiveIntegritySpilloverFromV1024(inputs: MacroEconomyInputs): MacroArchiveIntegritySpillover {
  const arch: any =
    inputs.historyArchiveIntegrity ??
    inputs.replayArchive?.integrity ??
    inputs.historyReplay?.archive ??
    inputs.nationalHistory?.archive;
  if (!arch) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const integrity = String(arch.integrityBand ?? arch.checksumBand ?? arch.fidelityBand ?? '');
  const lineage = String(arch.lineageBand ?? arch.provenanceBand ?? arch.chainBand ?? '');
  const retention = String(arch.retentionBand ?? arch.archiveRetention?.band ?? '');

  if (integrity === 'corrupt' || integrity === 'critical' || integrity === 'compromised') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Corrupt history archive (${integrity}) undermines macro confidence read.`;
  } else if (integrity === 'verified' || integrity === 'strong') {
    cycleNudge += 0.5;
  }

  if (lineage === 'broken' || lineage === 'discontinuous' || lineage === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Broken archive lineage distorts macro productivity interpretation.';
  }

  if (retention === 'truncated' || retention === 'critical' || retention === 'evaporating') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Truncated archive retention weakens macro investment evidence read.';
  } else if (retention === 'durable' || retention === 'complete') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroArchiveIntegritySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroArchiveIntegritySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
