import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAutomationIdleGovernanceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance spillover (Agent 20 wave 35 export). */
export function readMacroAutomationIdleGovernanceSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceSpillover {
  const gov: any =
    inputs.automationIdleGovernance ??
    inputs.idleAutomation?.governance ??
    inputs.automation?.idleGovernance ??
    inputs.nationalAutomation?.idleGovernance;
  if (!gov) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const governance = String(gov.governanceBand ?? gov.policyBand ?? gov.controlBand ?? '');
  const idle = String(gov.idleBand ?? gov.dormancyBand ?? gov.pauseBand ?? '');
  const escrow = String(gov.escrowBand ?? gov.commitBand ?? gov.holdBand ?? '');

  if (governance === 'escalated' || governance === 'critical' || governance === 'runaway') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = `Escalated automation idle governance (${governance}) drags macro investment read.`;
  } else if (governance === 'balanced' || governance === 'grounded') {
    investmentNudge += 1;
    summary = `Grounded idle governance (${governance}) supports macro investment interpretation.`;
  }

  if (idle === 'unbounded' || idle === 'critical' || idle === 'frozen') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Unbounded automation idle weakens macro productivity spillover.';
  }

  if (escrow === 'leaking' || escrow === 'critical' || escrow === 'misaligned') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Leaking automation escrow misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
