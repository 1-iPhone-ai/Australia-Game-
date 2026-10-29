import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type { NationalPriorityRankingContext } from '../types/national-priority.ts';
import type { TurnStrategicBriefing } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { computeCommitmentPressure } from './commitment-journal.ts';
import { pendingTradeOffCount } from './commitment-journal.ts';
import { summarizeMandateProgress } from './strategic-mandate.ts';
import { classifyMandateDriftRisk } from './mandate-idle-drift.ts';
import { computeCoalitionBalanceIndex } from './coalition-balance.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import { isProlongedCoalitionCrisis } from './coalition-crisis-pressure.ts';
import { isSustainedCoalitionRecovery } from './coalition-recovery-pressure.ts';
import { listStakeholderWarnings } from './stakeholder-coalition.ts';
import { rankStrategicActions } from './strategic-recommendations.ts';
import { listStrategicActions } from '../catalog/strategic-action-catalog.ts';

export function buildTurnStrategicBriefing(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  priorityCtx: NationalPriorityRankingContext | null,
  budget: { actionsUsedThisTurn: number; actionsPerTurn: number },
): TurnStrategicBriefing {
  const ranked = rankStrategicActions(
    listStrategicActions(),
    contracts,
    budget,
    priorityCtx,
    state,
  );
  const topFeasible = ranked.find((r) => r.feasible);

  return {
    day: state.day,
    commitmentPressure: computeCommitmentPressure(state),
    pendingTradeOffCount: pendingTradeOffCount(state),
    mandateHeadline: summarizeMandateProgress(state),
    stakeholderWarnings: listStakeholderWarnings(state),
    coalitionBalanceIndex: computeCoalitionBalanceIndex(state.stakeholderSentiment),
    coalitionCrisisLevel: classifyCoalitionCrisisLevel(state),
    coalitionCrisisStreakDays: state.coalitionCrisisStreakDays ?? 0,
    coalitionRecoveryStreakDays: state.coalitionRecoveryStreakDays ?? 0,
    prolongedCoalitionCrisis: isProlongedCoalitionCrisis(state),
    sustainedCoalitionRecovery: isSustainedCoalitionRecovery(state),
    coalitionVolatilityEvents: state.coalitionVolatilityEvents ?? 0,
    mandateDriftRisk: classifyMandateDriftRisk(state),
    completedActionCount: state.completedActionIds.length,
    activeChoiceId: state.activeChoice?.choiceId ?? null,
    ...(topFeasible
      ? {
          topRecommendationActionId: topFeasible.actionId,
          topRecommendationTitle: topFeasible.title,
        }
      : {}),
  };
}
