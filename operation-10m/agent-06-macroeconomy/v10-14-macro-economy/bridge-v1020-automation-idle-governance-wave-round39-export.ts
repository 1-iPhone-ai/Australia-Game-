import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAutomationIdleGovernanceWave39ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 39 export spillover (Agent 20 wave 39 export). */
export function readMacroAutomationIdleGovernanceWave39ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave39ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave39Export ??
    inputs.automationIdleGovernance?.wave39Export ??
    inputs.idleAutomation?.governanceWave39Export ??
    inputs.automation?.idleGovernanceWave39Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round39Ready = Boolean(
    exportPayload.round39Ready ??
      exportPayload.payload?.round39Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );

  if (!round39Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 39 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-209' || waveRound === 39) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 39 idle governance export latched (${o10Task || 'O10-209'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 2_050_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 39 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave39ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave39ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
