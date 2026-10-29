import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAutomationIdleGovernanceWave36ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 36 export spillover (Agent 20 wave 36 export). */
export function readMacroAutomationIdleGovernanceWave36ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave36ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave36Export ??
    inputs.automationIdleGovernance?.wave36Export ??
    inputs.idleAutomation?.governanceWave36Export ??
    inputs.automation?.idleGovernanceWave36Export ??
    inputs.nationalAutomation?.idleGovernanceWave36Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round36Ready = Boolean(
    exportPayload.round36Ready ??
      exportPayload.payload?.round36Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const hookLines: string[] =
    exportPayload.wave36HookLines ??
    exportPayload.payload?.wave36HookLines ??
    exportPayload.hookLines ??
    [];

  if (!round36Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 36 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-203' || waveRound === 36) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 36 idle governance export latched (${o10Task || 'O10-203'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 1_900_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 36 projected LOC hint misaligns macro cycle transmission.';
  }

  if (hookLines.some((line: string) => String(line).includes('round36_ready=false'))) {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Wave 36 export hooks report round36 not ready.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave36ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave36ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
