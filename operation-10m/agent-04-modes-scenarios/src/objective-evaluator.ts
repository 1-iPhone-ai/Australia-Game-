import type {
  PlayerSnapshot,
  ScenarioEvalContext,
  ScenarioObjective,
  ScenarioObjectiveProgress,
} from './types.js';

const BANKRUPTCY_THRESHOLD = 0;
const BANKRUPTCY_STREAK_DAYS = 3;

function regionsControlled(player: PlayerSnapshot, gameState: ScenarioEvalContext['gameState']): number {
  const history = gameState.regionControlStats?.controlHistory;
  if (Array.isArray(history) && history.length > 0) {
    return history.length;
  }
  const deposits = gameState.regionDeposits;
  if (deposits && typeof deposits === 'object') {
    return Object.keys(deposits).length;
  }
  return player.visitedRegions?.length ?? 0;
}

export function evaluateScenarioObjectiveProgress(
  objective: ScenarioObjective,
  context: ScenarioEvalContext,
): ScenarioObjectiveProgress {
  const { player, aiPlayer, gameState } = context;
  let currentValue = 0;
  const isPrimary = objective.isPrimary ?? true;

  switch (objective.targetType) {
    case 'money':
    case 'money_accumulated':
      currentValue = player.money ?? 0;
      break;
    case 'regions':
    case 'regions_controlled':
      currentValue = regionsControlled(player, gameState);
      break;
    case 'netWorth':
      currentValue =
        (player.money ?? 0) +
        (player.investments?.length ?? 0) * 1000 +
        regionsControlled(player, gameState) * 500;
      break;
    case 'daysPassed':
    case 'turns_survived':
      currentValue = gameState.day ?? 1;
      break;
    case 'standing_reached':
    case 'regionalStanding': {
      const vals = Object.values(player.regionalStanding || {}) as number[];
      currentValue = vals.length ? Math.max(...vals) : 0;
      break;
    }
    case 'multi_actor_standing_avg': {
      const vals = Object.values(player.regionalStanding || {}) as number[];
      currentValue = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      break;
    }
    case 'ai_eliminated': {
      const aiMoney = aiPlayer.money ?? 0;
      const streak = gameState.bankruptcyTracker?.ai ?? 0;
      currentValue = aiMoney < BANKRUPTCY_THRESHOLD && streak >= BANKRUPTCY_STREAK_DAYS ? 1 : 0;
      break;
    }
    case 'challenges':
    case 'challenges_completed':
      currentValue = Math.max(
        Object.keys(player.challengeMastery || {}).length,
        player.challengesCompleted?.length ?? 0,
      );
      break;
    case 'public_stability':
      currentValue = gameState.publicStabilityState?.nationalStability ?? 100;
      break;
    case 'crisis_resolved':
      currentValue = (gameState.crisisChainState?.activeCrisisChains || []).filter(c => c.status === 'resolved')
        .length;
      break;
    case 'debt_cleared':
      currentValue = (player.loans || []).length === 0 ? 1 : 0;
      break;
    case 'investments_count':
      currentValue = player.investments?.length ?? 0;
      break;
    case 'standing_threshold': {
      const vals = Object.values(player.regionalStanding || {}) as number[];
      currentValue = vals.length ? Math.max(...vals) : 0;
      break;
    }
    case 'specific_region_controlled': {
      const target = objective.targetRegionId || 'QLD';
      currentValue = player.currentRegion === target ? 1 : 0;
      break;
    }
    case 'zero_sabotage_taken':
      currentValue = (player.sabotageTargetedCount ?? 0) === 0 ? 1 : 0;
      break;
    case 'governance_proposals_passed':
      currentValue = (gameState.proposals || []).filter(p => p.status === 'passed').length;
      break;
    default:
      currentValue = 0;
  }

  const completed = currentValue >= objective.targetValue;
  return {
    objectiveId: objective.id,
    label: objective.label,
    description: objective.description,
    targetType: objective.targetType,
    currentValue,
    targetValue: objective.targetValue,
    completed,
    isPrimary,
  };
}

export { BANKRUPTCY_STREAK_DAYS, BANKRUPTCY_THRESHOLD };
