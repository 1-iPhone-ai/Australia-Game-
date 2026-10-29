import type {
  ResearchAdoptionHorizonOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic national adoption projection (read-only, round 8). */
export function computeResearchAdoptionHorizonOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    'diffusionForecast' | 'scaleWave' | 'synergyOutlook' | 'diffusion' | 'integrationRiskOutlook'
  >
): ResearchAdoptionHorizonOutlook {
  const forecast = ctx.diffusionForecast;
  const scaleWave = ctx.scaleWave;
  const synergy = ctx.synergyOutlook;
  const horizonTurns = forecast?.horizonTurns ?? 6;
  const integratedRegions = (ctx.diffusion ?? []).filter(c => c.level === 'integrated').length;
  const peakRegionId = forecast?.peakRegionId ?? null;
  const peakProjected = forecast?.peakProjectedScore ?? 0;
  const synergyContribution = Math.round(
    (scaleWave?.crossBranchSynergyScore ?? 0) * 0.35 + (synergy?.projectedSynergyScore ?? 0) * 0.15
  );
  const riskPenalty = Math.round((ctx.integrationRiskOutlook?.nationalRiskScore ?? 0) * 0.12);
  const nationalAdoptionScore = Math.min(
    100,
    Math.round(integratedRegions * 8 + peakProjected * 100 + synergyContribution * 0.2 - riskPenalty)
  );
  const growthPerTurn = Math.min(
    6,
    Math.round((scaleWave?.technologyTransferLinks.length ?? 0) * 1.5 + (synergy?.activeMultiBranchCount ?? 0))
  );
  const projectedAdoptionScore = Math.min(
    100,
    Math.round(nationalAdoptionScore + growthPerTurn * horizonTurns + peakProjected * 40)
  );

  return {
    active: inputs.turn >= 8 || nationalAdoptionScore > 0 || (scaleWave?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    nationalAdoptionScore,
    projectedAdoptionScore,
    peakRegionId,
    synergyContribution,
  };
}
