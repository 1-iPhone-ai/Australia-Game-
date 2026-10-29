import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAutomationIdleGovernanceWave44ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 44 export spillover (Agent 20 wave 44 export). */
export function readMacroAutomationIdleGovernanceWave44ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave44ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave44Export ??
    inputs.automationIdleGovernance?.wave44Export ??
    inputs.idleAutomation?.governanceWave44Export ??
    inputs.automation?.idleGovernanceWave44Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round44Ready = Boolean(
    exportPayload.round44Ready ??
      exportPayload.payload?.round44Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );

  if (!round44Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 44 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-219' || waveRound === 44) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 44 idle governance export latched (${o10Task || 'O10-219'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 2_480_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 44 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave44ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave44ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
