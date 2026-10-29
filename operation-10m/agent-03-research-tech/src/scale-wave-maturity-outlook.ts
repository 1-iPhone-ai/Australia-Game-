import { RESEARCH_NODE_BY_ID } from './branches.ts';
import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveMaturityLink,
  ResearchScaleWaveMaturityOutlook,
} from './types.ts';

/** Deterministic scale-wave maturity horizon (read-only, round 16). */
export function computeResearchScaleWaveMaturityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    'strategicDeliveryOutlook' | 'scaleWave' | 'strategicDeliverySnapshot' | 'unlockedNodes'
  >
): ResearchScaleWaveMaturityOutlook {
  const delivery = ctx.strategicDeliveryOutlook;
  const wave = ctx.scaleWave;
  const horizonTurns = delivery?.horizonTurns ?? 6;

  const synergyScore = Math.round(Math.min(100, Math.max(0, wave?.crossBranchSynergyScore ?? 0)));
  const transferBoost = Math.min(18, (wave?.technologyTransferLinks?.length ?? 0) * 4);
  const tierFiveUnlockedCount = (ctx.unlockedNodes ?? []).filter(
    u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5
  ).length;

  const nationalMaturityScore = Math.min(
    100,
    Math.round(
      (delivery?.nationalDeliveryScore ?? 0) * 0.38 +
        synergyScore * 0.32 +
        transferBoost +
        tierFiveUnlockedCount * 6
    )
  );
  const projectedMaturityScore = Math.min(
    100,
    Math.round(
      nationalMaturityScore +
        Math.max(0, (delivery?.projectedDeliveryScore ?? 0) - (delivery?.nationalDeliveryScore ?? 0)) * 0.25 +
        Math.max(0, synergyScore - 40) * 0.15
    )
  );

  const links: ResearchScaleWaveMaturityLink[] = (wave?.technologyTransferLinks ?? [])
    .slice(0, 4)
    .map(link => ({
      branchId: link.fromBranch,
      maturityPosture:
        link.strength >= 0.55 ? 'leading' : link.strength >= 0.35 ? 'aligned' : ('lagging' as const),
      synergyDelta: Math.round(link.strength * 100),
    }));

  const priorPeak = ctx.strategicDeliverySnapshot?.peakBand ?? 0;
  const deliveryMomentum = Math.max(0, (delivery?.nationalDeliveryScore ?? 0) - priorPeak * 0.35);

  return {
    active:
      inputs.turn >= 16 ||
      (delivery?.active ?? false) ||
      (wave?.active ?? false) ||
      nationalMaturityScore > 0 ||
      tierFiveUnlockedCount > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalMaturityScore,
    projectedMaturityScore,
    synergyHeadroom: Math.max(0, projectedMaturityScore - nationalMaturityScore),
    deliveryMomentum: Math.round(deliveryMomentum),
    tierFiveUnlockedCount,
    links,
  };
}
