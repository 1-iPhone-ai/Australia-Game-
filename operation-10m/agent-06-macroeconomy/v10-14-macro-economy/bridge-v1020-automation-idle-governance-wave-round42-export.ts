import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAutomationIdleGovernanceWave42ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 42 export spillover (Agent 20 wave 42 export). */
export function readMacroAutomationIdleGovernanceWave42ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave42ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave42Export ??
    inputs.automationIdleGovernance?.wave42Export ??
    inputs.idleAutomation?.governanceWave42Export ??
    inputs.automation?.idleGovernanceWave42Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round42Ready = Boolean(
    exportPayload.round42Ready ??
      exportPayload.payload?.round42Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );

  if (!round42Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 42 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-215' || waveRound === 42) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 42 idle governance export latched (${o10Task || 'O10-215'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 2_180_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 42 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave42ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave42ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
