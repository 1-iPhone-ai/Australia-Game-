import type {
  ResearchNationalIntegrationLink,
  ResearchNationalIntegrationOutlook,
  ResearchProgressInputs,
  ResearchProgressState,
} from './types.ts';

/** Deterministic national integration horizon (read-only, round 17). */
export function computeResearchNationalIntegrationOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveMaturityOutlook'
    | 'institutionTierSnapshot'
    | 'lateGameDiffusion'
    | 'scaleWaveMaturitySnapshot'
  >
): ResearchNationalIntegrationOutlook {
  const maturity = ctx.scaleWaveMaturityOutlook;
  const tiers = ctx.institutionTierSnapshot;
  const late = ctx.lateGameDiffusion;
  const horizonTurns = maturity?.horizonTurns ?? 6;

  const nationalIntegrationCount = tiers?.nationalIntegrationCount ?? 0;
  const strategicOrAbove = tiers?.strategicOrAboveCount ?? 0;
  const cascadeBoost = Math.round((late?.nationalPenetration ?? 0) * 100);

  const nationalIntegrationScore = Math.min(
    100,
    Math.round(
      (maturity?.nationalMaturityScore ?? 0) * 0.42 +
        nationalIntegrationCount * 9 +
        strategicOrAbove * 4 +
        cascadeBoost * 0.18
    )
  );
  const projectedIntegrationScore = Math.min(
    100,
    Math.round(
      nationalIntegrationScore +
        Math.max(0, (maturity?.projectedMaturityScore ?? 0) - (maturity?.nationalMaturityScore ?? 0)) * 0.28 +
        Math.max(0, (maturity?.synergyHeadroom ?? 0)) * 0.12
    )
  );

  const links: ResearchNationalIntegrationLink[] = (maturity?.links ?? [])
    .slice(0, 4)
    .map(link => ({
      branchId: link.branchId,
      integrationPosture:
        link.maturityPosture === 'leading'
          ? 'anchor'
          : link.maturityPosture === 'aligned'
            ? 'integrate'
            : ('observe' as const),
      maturityDelta: link.synergyDelta,
    }));

  const priorPeak = ctx.scaleWaveMaturitySnapshot?.peakBand ?? 0;
  const maturityMomentum = Math.max(0, (maturity?.nationalMaturityScore ?? 0) - priorPeak * 0.35);

  return {
    active:
      inputs.turn >= 17 ||
      (maturity?.active ?? false) ||
      nationalIntegrationCount > 0 ||
      nationalIntegrationScore > 0 ||
      links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalIntegrationScore,
    projectedIntegrationScore,
    institutionIntegrationHeadroom: Math.max(0, 6 - nationalIntegrationCount) * 12,
    maturityMomentum: Math.round(maturityMomentum),
    nationalIntegrationCount,
    links,
  };
}
