import type { ResearchDiffusionForecast, ResearchProgressInputs, ResearchProgressState } from './types.ts';
import { RESEARCH_NODE_BY_ID } from './branches.ts';

const MAX_HORIZON = 24;

function clampHorizon(turns: number): number {
  return Math.max(1, Math.min(MAX_HORIZON, Math.floor(turns)));
}

/** Deterministic diffusion projection for dashboards (read-only, round 5). */
export function projectResearchDiffusionHorizon(
  inputs: ResearchProgressInputs,
  state: Pick<ResearchProgressState, 'diffusion' | 'unlockedNodes' | 'institutionUpgrades'>,
  horizonTurns = 6
): ResearchDiffusionForecast {
  const horizon = clampHorizon(horizonTurns);
  const perTurnSeed =
    state.unlockedNodes.reduce((acc, u) => acc + (RESEARCH_NODE_BY_ID[u.nodeId]?.diffusionSeed ?? 0), 0) * 0.012;
  const institutionBoost =
    (state.institutionUpgrades?.reduce((a, u) => a + u.diffusionMultiplier, 0) ?? 0) * 0.004;

  const projections: ResearchDiffusionForecast['projections'] = [];
  for (let h = 1; h <= horizon; h++) {
    const turn = inputs.turn + h;
    for (const cell of state.diffusion) {
      const drift = perTurnSeed + institutionBoost + (cell.institutionBoost ?? 0) * 0.002;
      const projectedScore = Math.min(0.85, Math.round((cell.score + drift * h) * 1000) / 1000);
      projections.push({
        turn,
        regionId: cell.regionId,
        projectedScore,
        deltaFromNow: Math.round((projectedScore - cell.score) * 1000) / 1000,
      });
    }
  }

  const finalTurn = inputs.turn + horizon;
  const atHorizon = projections.filter(p => p.turn === finalTurn);
  const peak = atHorizon.reduce(
    (best, p) => (!best || p.projectedScore > best.projectedScore ? p : best),
    null as (typeof atHorizon)[number] | null
  );

  return {
    active: state.unlockedNodes.length > 0,
    baseTurn: inputs.turn,
    horizonTurns: horizon,
    peakRegionId: peak?.regionId ?? null,
    peakProjectedScore: peak?.projectedScore ?? 0,
    projections: projections.slice(0, horizon * state.diffusion.length),
  };
}
