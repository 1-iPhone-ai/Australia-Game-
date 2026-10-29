/**
 * Agent 21 — player surfacing scorecard (gates + backtest + regret composite, read-only).
 */

import { evaluateAg21ReliabilityGates } from './forecast-reliability-gates';
import { rankAg21PolicyRegret } from './forecast-policy-regret';
import { runAg21EnsembleResidualBacktest } from './forecast-residual-backtest';
import { measureAg21HorizonVolatility } from './forecast-horizon-volatility';
import { ag21LabelUncertainty, type Ag21UncertaintyBand, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21SurfacingScorecard {
  readinessScore: number;
  tier: 'green' | 'amber' | 'red';
  gatePassRatio: number;
  backtestTone: ReturnType<typeof runAg21EnsembleResidualBacktest>['calibrationTone'];
  regretSpread: number;
  horizonStability: ReturnType<typeof measureAg21HorizonVolatility>['stabilityTone'];
  playerGuidance: 'surface_brief' | 'surface_with_caveats' | 'suppress';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TierFromScore(score: number): Ag21SurfacingScorecard['tier'] {
  if (score >= 72) return 'green';
  if (score >= 45) return 'amber';
  return 'red';
}

function ag21GuidanceFromTier(tier: Ag21SurfacingScorecard['tier']): Ag21SurfacingScorecard['playerGuidance'] {
  if (tier === 'green') return 'surface_brief';
  if (tier === 'amber') return 'surface_with_caveats';
  return 'suppress';
}

function ag21BandFromTier(tier: Ag21SurfacingScorecard['tier']): Ag21UncertaintyBand {
  if (tier === 'green') return 'low';
  if (tier === 'amber') return 'moderate';
  return 'high';
}

function ag21ToneScore(tone: Ag21SurfacingScorecard['backtestTone']): number {
  if (tone === 'tight') return 28;
  if (tone === 'balanced') return 18;
  return 8;
}

function ag21StabilityScore(tone: Ag21SurfacingScorecard['horizonStability']): number {
  if (tone === 'steady') return 22;
  if (tone === 'wobbly') return 12;
  return 4;
}

/** Composite scorecard for whether lab outputs may surface to players (non-authoritative). */
export function buildAg21SurfacingScorecard(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21SurfacingScorecard {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.8),
      actorDebt: baseCtx.actorDebt + 120
    } satisfies Ag21ForecastContext);

  const gates = evaluateAg21ReliabilityGates(baseCtx, candidate);
  const backtest = runAg21EnsembleResidualBacktest(baseCtx);
  const regret = rankAg21PolicyRegret(baseCtx);
  const volatility = measureAg21HorizonVolatility(baseCtx);

  const gatePassRatio = gates.passCount / Math.max(1, gates.gates.length);
  const regretSpread =
    regret.rows.length >= 2
      ? Math.abs(regret.rows[regret.rows.length - 1].regretScore - regret.rows[0].regretScore)
      : 0;

  const readinessScore = Math.min(
    100,
    Math.round(
      gatePassRatio * 40 +
        ag21ToneScore(backtest.calibrationTone) +
        ag21StabilityScore(volatility.stabilityTone) +
        Math.max(0, 10 - regretSpread * 12)
    )
  );

  const tier = ag21TierFromScore(readinessScore);

  return {
    readinessScore,
    tier,
    gatePassRatio,
    backtestTone: backtest.calibrationTone,
    regretSpread,
    horizonStability: volatility.stabilityTone,
    playerGuidance: ag21GuidanceFromTier(tier),
    overallUncertainty: ag21LabelUncertainty(ag21BandFromTier(tier), [`score=${readinessScore}`]),
    authoritative: false
  };
}

export function runAg21SurfacingScorecardSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 10, seed: 19, actorCash: 1050, actorDebt: 65, regionsControlled: 3 };
  const card = buildAg21SurfacingScorecard(ctx);

  push('score_range', card.readinessScore >= 0 && card.readinessScore <= 100, String(card.readinessScore));
  push('score_tier', ['green', 'amber', 'red'].includes(card.tier), card.tier);
  push('score_guidance', ['surface_brief', 'surface_with_caveats', 'suppress'].includes(card.playerGuidance), card.playerGuidance);
  push('score_non_auth', card.authoritative === false, String(card.readinessScore));

  return out;
}
