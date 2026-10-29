import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroCadenceDriftSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.02 turn cadence drift spillover (Agent 02 domain; distinct from turn backlog layer). */
export function readMacroCadenceDriftSpilloverFromV1002(inputs: MacroEconomyInputs): MacroCadenceDriftSpillover {
  const cd: any =
    inputs.turnCadenceDrift ??
    inputs.turnsTime?.cadenceDrift ??
    inputs.temporalCadence?.drift ??
    inputs.gameClock?.cadence;
  if (!cd) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const skew = String(cd.skewBand ?? cd.driftBand ?? cd.phaseSkew?.band ?? '');
  const jitter = String(cd.jitterBand ?? cd.clockJitter?.band ?? '');
  const resolution = String(cd.resolutionBand ?? cd.turnResolution?.band ?? '');

  if (skew === 'severe' || skew === 'runaway' || skew === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Severe turn cadence skew (${skew}) distorts macro cycle timing read.`;
  } else if (skew === 'balanced' || skew === 'anchored') {
    cycleNudge += 0.5;
  }

  if (jitter === 'chaotic' || jitter === 'critical' || jitter === 'extreme') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Chaotic clock jitter weakens macro investment signal stability.';
  }

  if (resolution === 'slipped' || resolution === 'critical' || resolution === 'missed') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Missed turn resolution cadence drags macro productivity read.';
  } else if (resolution === 'crisp' || resolution === 'on_time') {
    productivityNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCadenceDriftSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCadenceDriftSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
