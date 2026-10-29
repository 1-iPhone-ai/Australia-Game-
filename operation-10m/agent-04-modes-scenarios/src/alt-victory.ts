import type {
  O10mAltVictoryRule,
  O10mAltVictoryRuleId,
  ScenarioEvalContext,
  ScenarioObjective,
  ScenarioOutcome,
} from './types.js';
import { evaluateScenarioObjectiveProgress } from './objective-evaluator.js';

export const O10M_ALT_VICTORY_RULES: O10mAltVictoryRule[] = [
  {
    id: 'o10m_diplomatic_consensus',
    title: 'Diplomatic Consensus',
    description: 'Win without eliminating the rival when average standing and governance thresholds are met.',
    scenarioIds: ['o10m_silent_diplomat', 'o10m_team_ledger'],
    allowsPrimaryIncomplete: true,
  },
  {
    id: 'o10m_economic_dominance',
    title: 'Economic Dominance',
    description: 'Player net worth is at least double rival net worth at day limit minus one.',
    scenarioIds: '*',
    allowsPrimaryIncomplete: true,
  },
  {
    id: 'o10m_speed_primary_clear',
    title: 'Speed Clear',
    description: 'All primary objectives complete on or before day 14.',
    scenarioIds: ['o10m_export_clock', 'o10m_grand_tour_prologue'],
    allowsPrimaryIncomplete: false,
  },
  {
    id: 'o10m_optional_perfection',
    title: 'Optional Perfection',
    description: 'All objectives including optional ones are complete while primary victory is already true.',
    scenarioIds: '*',
    allowsPrimaryIncomplete: false,
  },
];

const RULES_BY_ID: Record<O10mAltVictoryRuleId, O10mAltVictoryRule> = O10M_ALT_VICTORY_RULES.reduce(
  (acc, rule) => {
    acc[rule.id] = rule;
    return acc;
  },
  {} as Record<O10mAltVictoryRuleId, O10mAltVictoryRule>,
);

export function getO10mAltVictoryRule(id: O10mAltVictoryRuleId): O10mAltVictoryRule {
  return RULES_BY_ID[id];
}

export interface AltVictoryEvalResult {
  triggered: boolean;
  ruleId: O10mAltVictoryRuleId | null;
  reason: string;
}

function scenarioMatchesRule(scenarioId: string, rule: O10mAltVictoryRule): boolean {
  if (rule.scenarioIds === '*') return scenarioId.startsWith('o10m_');
  return rule.scenarioIds.includes(scenarioId);
}

function evaluateRule(
  rule: O10mAltVictoryRule,
  scenarioId: string,
  primary: ScenarioOutcome,
  context: ScenarioEvalContext,
): AltVictoryEvalResult {
  if (!scenarioMatchesRule(scenarioId, rule)) {
    return { triggered: false, ruleId: null, reason: 'Scenario not eligible for rule.' };
  }

  if (!rule.allowsPrimaryIncomplete && !primary.allPrimaryCompleted) {
    return { triggered: false, ruleId: null, reason: 'Primary objectives incomplete.' };
  }

  const standingValues = Object.values(context.player.regionalStanding || {});
  const avgStanding = standingValues.length
    ? standingValues.reduce((a, b) => a + b, 0) / standingValues.length
    : 0;
  const proposalsPassed = (context.gameState.proposals || []).filter(p => p.status === 'passed').length;
  const playerNw = context.player.money ?? 0; // standalone snapshot uses money as NW proxy when investments absent
  const rivalNw = context.aiPlayer.money ?? 0;
  const day = context.gameState.day;

  switch (rule.id) {
    case 'o10m_diplomatic_consensus': {
      const aiEliminated = (context.aiPlayer.money ?? 0) < 0 && (context.gameState.bankruptcyTracker?.ai ?? 0) >= 3;
      const ok = !aiEliminated && avgStanding >= 55 && proposalsPassed >= 1;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Diplomatic consensus: high standing without rival elimination.' }
        : { triggered: false, ruleId: null, reason: 'Diplomatic thresholds not met.' };
    }
    case 'o10m_economic_dominance': {
      const ok = playerNw >= rivalNw * 2 && rivalNw > 0;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Economic dominance: net worth doubled rival.' }
        : { triggered: false, ruleId: null, reason: 'Dominance ratio not met.' };
    }
    case 'o10m_speed_primary_clear': {
      const ok = primary.allPrimaryCompleted && day <= 14;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Speed clear: primaries finished by day 14.' }
        : { triggered: false, ruleId: null, reason: 'Speed day threshold missed.' };
    }
    case 'o10m_optional_perfection': {
      const ok = primary.allOptionalCompleted && primary.isVictory;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Optional perfection: all objectives complete.' }
        : { triggered: false, ruleId: null, reason: 'Optional objectives incomplete.' };
    }
    default:
      return { triggered: false, ruleId: null, reason: 'Unknown rule.' };
  }
}

export function evaluateO10mAltVictory(
  scenarioId: string,
  primary: ScenarioOutcome,
  context: ScenarioEvalContext,
): AltVictoryEvalResult {
  for (const rule of O10M_ALT_VICTORY_RULES) {
    const result = evaluateRule(rule, scenarioId, primary, context);
    if (result.triggered) return result;
  }
  return { triggered: false, ruleId: null, reason: 'No alternate victory triggered.' };
}

/** Standalone primary outcome evaluator (subset of canonical `evaluateScenarioOutcome`). */
export function evaluateO10mScenarioPrimaryOutcome(
  objectives: ScenarioObjective[],
  context: ScenarioEvalContext,
): ScenarioOutcome {
  const objectivesProgress: ScenarioOutcome['objectivesProgress'] = {};
  let primaryCount = 0;
  let primaryCompletedCount = 0;
  let totalCompleted = 0;

  for (const obj of objectives) {
    const prog = evaluateScenarioObjectiveProgress(obj, context);
    objectivesProgress[obj.id] = prog;
    const isPrimary = obj.isPrimary ?? true;
    if (isPrimary) {
      primaryCount++;
      if (prog.completed) primaryCompletedCount++;
    }
    if (prog.completed) totalCompleted++;
  }

  const allPrimaryCompleted = primaryCount > 0 && primaryCompletedCount === primaryCount;
  const allOptionalCompleted = totalCompleted === objectives.length;
  const day = context.gameState.day;
  const bankrupt = (context.player.money ?? 0) < 0 && (context.gameState.bankruptcyTracker?.player ?? 0) >= 3;
  const maxDays = context.gameSettings.totalDays;

  let isGameOver = false;
  let isVictory = false;
  let isDefeat = false;
  let reason = '';

  if (allPrimaryCompleted) {
    isGameOver = true;
    isVictory = true;
    reason = `Scenario victory on day ${day}.`;
  } else if (bankrupt) {
    isGameOver = true;
    isDefeat = true;
    reason = `Bankruptcy on day ${day}.`;
  } else if (day > maxDays) {
    isGameOver = true;
    isDefeat = true;
    reason = `Day limit ${maxDays} exceeded.`;
  }

  return {
    isGameOver,
    isVictory,
    isDefeat,
    reason,
    objectivesProgress,
    allPrimaryCompleted,
    allOptionalCompleted,
    completedOnDay: day,
  };
}
