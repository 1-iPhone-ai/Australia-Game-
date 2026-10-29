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
  stellarTranscendenceRankingBonus,
  quantumOmnipresenceRankingBonus,
  multiversalPersistenceRankingBonus,
  metaversalContinuityRankingBonus,
  omniversalSynthesisRankingBonus,
  hyperversalHarmonizationRankingBonus,
  transcendentOmniumRankingBonus,
  supremeConvergenceRankingBonus,
  apexTranscendenceRankingBonus,
  zenithPerpetuityRankingBonus,
  paragonInfinityRankingBonus,
  paramountAscendancyRankingBonus,
  imperialPerpetuityRankingBonus,
  custodialEternityRankingBonus,
  vanguardSynthesisRankingBonus,
  sentinelAscendancyRankingBonus,
  oraclePerpetuityRankingBonus,
  archonEternityRankingBonus,
  exarchAscendancyRankingBonus,
  primarchPerpetuityRankingBonus,
  patriarchEternityRankingBonus,
  matriarchAscendancyRankingBonus,
  matriarchPerpetuityRankingBonus,
  matriarchEternityRankingBonus,
  matriarchInfinityRankingBonus,
  matriarchTranscendenceRankingBonus,
  matriarchApotheosisRankingBonus,
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
        galacticInfinityRankingBonus(state, action) +
        stellarTranscendenceRankingBonus(state, action) +
        quantumOmnipresenceRankingBonus(state, action) +
        multiversalPersistenceRankingBonus(state, action) +
        metaversalContinuityRankingBonus(state, action) +
        omniversalSynthesisRankingBonus(state, action) +
        hyperversalHarmonizationRankingBonus(state, action) +
        transcendentOmniumRankingBonus(state, action) +
        supremeConvergenceRankingBonus(state, action) +
        apexTranscendenceRankingBonus(state, action) +
        zenithPerpetuityRankingBonus(state, action) +
        paragonInfinityRankingBonus(state, action) +
        paramountAscendancyRankingBonus(state, action) +
        imperialPerpetuityRankingBonus(state, action) +
        custodialEternityRankingBonus(state, action) +
        vanguardSynthesisRankingBonus(state, action) +
        sentinelAscendancyRankingBonus(state, action) +
        oraclePerpetuityRankingBonus(state, action) +
        archonEternityRankingBonus(state, action) +
        exarchAscendancyRankingBonus(state, action) +
        primarchPerpetuityRankingBonus(state, action) +
        patriarchEternityRankingBonus(state, action) +
        matriarchAscendancyRankingBonus(state, action) +
        matriarchPerpetuityRankingBonus(state, action) +
        matriarchEternityRankingBonus(state, action) +
        matriarchInfinityRankingBonus(state, action) +
        matriarchTranscendenceRankingBonus(state, action) +
        matriarchApotheosisRankingBonus(state, action),
      alignmentBand: alignment?.band ?? 'unknown',
      blockerCodes: issues.map((i) => i.code),
    });
  }

  return recommendations.sort((a, b) => {
    if (a.feasible !== b.feasible) return a.feasible ? -1 : 1;
    return b.alignmentScore - a.alignmentScore;
  });
}
