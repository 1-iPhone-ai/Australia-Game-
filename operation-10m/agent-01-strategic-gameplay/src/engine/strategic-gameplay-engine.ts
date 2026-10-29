import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type { NationalPriorityRankingContext } from '../types/national-priority.ts';
import type {
  ExecuteActionResult,
  MultiStageChoiceDefinition,
  PlayerActionBudget,
  StrategicActionDefinition,
  StrategicGameplayState,
} from '../types/strategic-action.ts';
import {
  appendJournalEntry,
  DEFAULT_MAX_PENDING_TRADE_OFFS,
} from './commitment-journal.ts';
import {
  applyDomainEffects,
  scheduleDelayedTradeOffs,
} from './delayed-effects.ts';
import {
  scoreNationalPriorityAlignment,
  validateAction,
  validateChoiceOption,
} from './validation.ts';

export function createInitialStrategicState(day = 1): StrategicGameplayState {
  return {
    day,
    pendingDelayed: [],
    completedActionIds: [],
    journal: [],
    activeChoice: null,
  };
}

export function beginMultiStageChoice(
  state: StrategicGameplayState,
  choice: MultiStageChoiceDefinition,
): StrategicGameplayState {
  return {
    ...state,
    activeChoice: { choiceId: choice.choiceId, stageId: choice.entryStageId },
  };
}

export interface AdvanceChoiceResult {
  state: StrategicGameplayState;
  resolvedActionId?: string;
  issues?: ExecuteActionResult['issues'];
}

export function advanceMultiStageChoice(
  state: StrategicGameplayState,
  choice: MultiStageChoiceDefinition,
  optionId: string,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
): AdvanceChoiceResult {
  if (!state.activeChoice || state.activeChoice.choiceId !== choice.choiceId) {
    return {
      state,
      issues: [
        {
          code: 'NO_ACTIVE_CHOICE',
          message: 'No matching multi-stage choice in progress.',
          requirement: { kind: 'min_cash', amount: 0 },
        },
      ],
    };
  }

  const issues = validateChoiceOption(
    choice,
    state.activeChoice.stageId,
    optionId,
    contracts,
    budget,
  );
  if (issues.length > 0) return { state, issues };

  const stage = choice.stages.find((s) => s.stageId === state.activeChoice!.stageId)!;
  const option = stage.options.find((o) => o.optionId === optionId)!;

  if (option.nextStageId) {
    return {
      state: {
        ...state,
        activeChoice: { choiceId: choice.choiceId, stageId: option.nextStageId },
      },
    };
  }

  if (!option.resolvesActionId) {
    return {
      state: { ...state, activeChoice: null },
      issues: [
        {
          code: 'DEAD_END',
          message: 'Choice path does not resolve to an action.',
          requirement: { kind: 'min_cash', amount: 0 },
        },
      ],
    };
  }

  return {
    state: { ...state, activeChoice: null },
    resolvedActionId: option.resolvesActionId,
  };
}

export function executeStrategicAction(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  priorityCtx: NationalPriorityRankingContext | null,
  options?: { delayDays?: number; maxPendingTradeOffs?: number },
): ExecuteActionResult {
  const maxPending = options?.maxPendingTradeOffs ?? DEFAULT_MAX_PENDING_TRADE_OFFS;
  const issues = validateAction(action, contracts, budget, [], state, {
    maxPendingTradeOffs: maxPending,
  });
  if (issues.length > 0) return { ok: false, issues, state };

  applyDomainEffects(contracts, action.immediateEffects);

  const alignment = scoreNationalPriorityAlignment(action, priorityCtx);
  if (alignment && alignment.band === 'strong') {
    contracts.government.applyPatch({ approvalDelta: 1, ledgerNote: alignment.reason });
  } else if (alignment && alignment.band === 'conflict') {
    contracts.government.applyPatch({ approvalDelta: -2, ledgerNote: alignment.reason });
  }

  const delayDays = options?.delayDays ?? 3;
  let nextState = scheduleDelayedTradeOffs(
    state,
    action.id,
    action.delayedTradeOffs,
    delayDays,
  );
  nextState = {
    ...nextState,
    completedActionIds: [...nextState.completedActionIds, action.id],
  };
  nextState = appendJournalEntry(
    nextState,
    action,
    alignment?.band ?? null,
    action.delayedTradeOffs.length,
  );

  contracts.ui.pushToast({
    id: `action_${action.id}_${state.day}`,
    severity: 'success',
    title: action.title,
    body:
      action.delayedTradeOffs.length > 0
        ? `${action.title} committed — ${action.delayedTradeOffs.length} delayed trade-off(s) scheduled.`
        : `${action.title} completed.`,
    day: state.day,
  });

  contracts.ui.setActionHudSummary(
    budget.actionsUsedThisTurn + action.apCost,
    budget.actionsPerTurn,
    nextState.pendingDelayed.length,
  );

  return {
    ok: true,
    state: nextState,
    appliedActionId: action.id,
    scheduledTradeOffs: nextState.pendingDelayed.filter(
      (p) => p.sourceActionId === action.id,
    ),
  };
}

export function presentActiveChoiceStage(
  choice: MultiStageChoiceDefinition,
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  priorityCtx: NationalPriorityRankingContext | null,
  actionCatalog: Record<string, StrategicActionDefinition>,
): void {
  if (!state.activeChoice) return;
  const stage = choice.stages.find((s) => s.stageId === state.activeChoice!.stageId);
  if (!stage) return;

  const linked = actionCatalog[choice.linkedActionId];
  const alignment = linked ? scoreNationalPriorityAlignment(linked, priorityCtx) : null;
  const preview =
    linked?.delayedTradeOffs[0]?.warning ??
    (linked?.delayedTradeOffs.length ? 'Downstream costs apply later.' : undefined);

  const blocked = stage.options.every(
    (o) =>
      validateChoiceOption(choice, stage.stageId, o.optionId, contracts, budget).length > 0,
  );

  contracts.ui.presentChoice({
    choiceId: choice.choiceId,
    stageId: stage.stageId,
    title: choice.title,
    summary: stage.prompt,
    optionLabels: stage.options.map((o) => o.label),
    blockedReason: blocked ? 'No legal option at this stage.' : undefined,
    nationalPriorityHint: alignment?.reason,
    delayedTradeOffPreview: preview,
  });
}
