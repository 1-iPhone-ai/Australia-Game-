import { REGIONAL_MIGRATION_CORRIDORS } from './catalog/regional-migration-corridors';
import type {
  IntegratedLaborMarketBrief,
  InterregionalLaborRebalancingPlan,
  LaborRebalancingMove,
  NationalLaborDemographicsState,
  NationalWorkforceCapacityBridge
} from './types';

function movePriority(relief: number): LaborRebalancingMove['priority'] {
  if (relief >= 12) return 'high';
  if (relief >= 6) return 'medium';
  return 'low';
}

export function computeInterregionalLaborRebalancingPlan(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): InterregionalLaborRebalancingPlan {
  if (!state.enabled || !brief) {
    return { turn: state.turn, moves: [], summary: 'Rebalancing idle — labor layer off.' };
  }

  const strainSet = new Set(brief.topStrainRegions);
  const opportunitySet = new Set(brief.topOpportunityRegions);
  const moves: LaborRebalancingMove[] = [];

  REGIONAL_MIGRATION_CORRIDORS.forEach(c => {
    const fromStrain = strainSet.has(c.fromRegionId);
    const toOpportunity = opportunitySet.has(c.toRegionId);
    const fromGap = capacityBridge?.regions[c.fromRegionId]?.gapIndex ?? 50;
    const toGap = capacityBridge?.regions[c.toRegionId]?.gapIndex ?? 50;
    if (!fromStrain && fromGap < 45) return;
    if (!toOpportunity && toGap > 55) return;
    const relief = (fromGap - toGap) * 0.2 * c.strength;
    if (relief < 2.5) return;
    moves.push({
      id: `rebal_${c.id}`,
      fromRegionId: c.fromRegionId,
      toRegionId: c.toRegionId,
      priority: movePriority(relief),
      rationale: `${c.label}: ease ${c.fromRegionId} strain toward ${c.toRegionId} opportunity (${c.industryTheme}).`,
      expectedRelief: Math.round(relief * 10) / 10
    });
  });

  moves.sort((a, b) => b.expectedRelief - a.expectedRelief);
  const top = moves.slice(0, 5);
  const summary = top.length
    ? `Rebalancing plan: ${top.map(m => `${m.fromRegionId}→${m.toRegionId} (${m.priority})`).join('; ')}.`
    : 'No interregional rebalancing moves recommended this turn.';

  return { turn: state.turn, moves: top, summary };
}
