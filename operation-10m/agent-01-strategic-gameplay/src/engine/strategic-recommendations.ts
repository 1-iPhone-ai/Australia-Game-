import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type { NationalPriorityRankingContext } from '../types/national-priority.ts';
import type {
  PlayerActionBudget,
  StrategicActionDefinition,
  StrategicActionRecommendation,
  StrategicGameplayState,
} from '../types/strategic-action.ts';
import { priorityMomentumBonus } from './priority-momentum.ts';
import { detectStrategicSynergies, synergyScoreBonus } from './strategic-synergies.ts';
import { STRATEGIC_ACTION_CATALOG } from '../catalog/strategic-action-catalog.ts';
import { mandateRankingBonus } from './strategic-mandate.ts';
import {
  coalitionBalanceRankingBonus,
  coalitionRecoveryRankingBonus,
  sustainedRecoveryRankingBonus,
  stabilizationRankingBonus,
  lockInRankingBonus,
  crossModuleSyncRankingBonus,
  integratedMaturityRankingBonus,
  stewardshipRankingBonus,
  anchoredGovernanceRankingBonus,
  institutionalPermanenceRankingBonus,
  generationalContinuityRankingBonus,
  civilizationalEnduranceRankingBonus,
  transcendentLegacyRankingBonus,
  sovereignContinuumRankingBonus,
  eternalAscendanceRankingBonus,
  infinitePersistenceRankingBonus,
  primordialContinuityRankingBonus,
  absoluteSanctityRankingBonus,
  universalImmortalityRankingBonus,
  cosmicPerpetuityRankingBonus,
  galacticInfinityRankingBonus,
} from './coalition-balance.ts';
import { scoreNationalPriorityAlignment, validateAction } from './validation.ts';

export function rankStrategicActions(
  actions: StrategicActionDefinition[],
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  priorityCtx: NationalPriorityRankingContext | null,
  state: StrategicGameplayState,
  options?: { maxPendingTradeOffs?: number },
): StrategicActionRecommendation[] {
  const maxPending = options?.maxPendingTradeOffs ?? 8;
  const recommendations: StrategicActionRecommendation[] = [];

  for (const action of actions) {
    const issues = validateAction(action, contracts, budget, [], state, {
      maxPendingTradeOffs: maxPending,
    });
    const alignment = scoreNationalPriorityAlignment(action, priorityCtx);
    const synergies = detectStrategicSynergies(state, action, STRATEGIC_ACTION_CATALOG);
    recommendations.push({
      actionId: action.id,
      title: action.title,
      feasible: issues.length === 0,
      alignmentScore:
        (alignment?.score ?? 0) +
        priorityMomentumBonus(state, action) +
        synergyScoreBonus(synergies) +
        mandateRankingBonus(state, action) +
        coalitionBalanceRankingBonus(state) +
        coalitionRecoveryRankingBonus(state, action) +
        sustainedRecoveryRankingBonus(state, action) +
        stabilizationRankingBonus(state, action) +
        lockInRankingBonus(state, action) +
        crossModuleSyncRankingBonus(state, action) +
        integratedMaturityRankingBonus(state, action) +
        stewardshipRankingBonus(state, action) +
        anchoredGovernanceRankingBonus(state, action) +
        institutionalPermanenceRankingBonus(state, action) +
        generationalContinuityRankingBonus(state, action) +
        civilizationalEnduranceRankingBonus(state, action) +
        transcendentLegacyRankingBonus(state, action) +
        sovereignContinuumRankingBonus(state, action) +
        eternalAscendanceRankingBonus(state, action) +
        infinitePersistenceRankingBonus(state, action) +
        primordialContinuityRankingBonus(state, action) +
        absoluteSanctityRankingBonus(state, action) +
        universalImmortalityRankingBonus(state, action) +
        cosmicPerpetuityRankingBonus(state, action) +
        galacticInfinityRankingBonus(state, action),
      alignmentBand: alignment?.band ?? 'unknown',
      blockerCodes: issues.map((i) => i.code),
    });
  }

  return recommendations.sort((a, b) => {
    if (a.feasible !== b.feasible) return a.feasible ? -1 : 1;
    return b.alignmentScore - a.alignmentScore;
  });
}
