/**
 * Agent 21 — player-facing forecast brief assembler (scorecard stack, read-only).
 */

import { buildAg21LeverAttributionReport } from './forecast-lever-attribution';
import { measureAg21HorizonVolatility } from './forecast-horizon-volatility';
import { buildAg21SurfacingScorecard } from './forecast-surfacing-scorecard';
import { measureAg21EnsembleConvergence } from './forecast-ensemble-convergence';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21PlayerForecastBrief {
  headline: string;
  bullets: string[];
  readinessScore: number;
  surfacingTier: ReturnType<typeof buildAg21SurfacingScorecard>['tier'];
  convergenceTone: ReturnType<typeof measureAg21EnsembleConvergence>['convergenceTone'];
  topLever: string | null;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Assemble a non-authoritative player brief from round 5–6 lab signals. */
export function assembleAg21PlayerForecastBrief(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21PlayerForecastBrief {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.8),
      actorDebt: baseCtx.actorDebt + 120
    } satisfies Ag21ForecastContext);

  const scorecard = buildAg21SurfacingScorecard(baseCtx, candidate);
  const volatility = measureAg21HorizonVolatility(baseCtx);
  const attribution = buildAg21LeverAttributionReport(baseCtx);
  const convergence = measureAg21EnsembleConvergence(baseCtx);

  const bullets = [
    `Readiness ${scorecard.readinessScore}/100 (${scorecard.tier}) · guidance ${scorecard.playerGuidance}.`,
    `Horizon stability ${volatility.stabilityTone}; volatility index ${volatility.compositeVolatility.toFixed(2)}.`,
    `Top sensitivity lever ${attribution.topLever ?? 'none'}; convergence ${convergence.convergenceTone}.`
  ];

  const headline = `Forecast brief · ${scorecard.playerGuidance.replace(/_/g, ' ')} · ${convergence.convergenceTone} ensemble/fusion.`;

  return {
    headline,
    bullets,
    readinessScore: scorecard.readinessScore,
    surfacingTier: scorecard.tier,
    convergenceTone: convergence.convergenceTone,
    topLever: attribution.topLever,
    overallUncertainty: ag21LabelUncertainty(scorecard.overallUncertainty.band, [
      ...scorecard.overallUncertainty.factors,
      `convergence=${convergence.convergenceTone}`
    ]),
    authoritative: false
  };
}

export function runAg21PlayerBriefSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 11, seed: 26, actorCash: 990, actorDebt: 70, regionsControlled: 3 };
  const brief = assembleAg21PlayerForecastBrief(ctx);

  push('brief_bullets', brief.bullets.length === 3, String(brief.bullets.length));
  push('brief_headline', brief.headline.includes('Forecast brief'), brief.headline);
  push('brief_readiness', brief.readinessScore >= 0 && brief.readinessScore <= 100, String(brief.readinessScore));
  push('brief_non_auth', brief.authoritative === false, brief.headline);

  return out;
}
