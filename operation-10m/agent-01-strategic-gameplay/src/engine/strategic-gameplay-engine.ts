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
import { applyPriorityMomentum } from './priority-momentum.ts';
import { STRATEGIC_ACTION_CATALOG } from '../catalog/strategic-action-catalog.ts';
import {
  applySynergyApprovalBoost,
  detectStrategicSynergies,
  startActionCooldown,
} from './strategic-synergies.ts';
import {
  applyDomainEffects,
  scheduleDelayedTradeOffs,
} from './delayed-effects.ts';
import { advanceMandateOnAction } from './strategic-mandate.ts';
import { applyStakeholderReaction } from './stakeholder-coalition.ts';
import { touchLastAlignedActionDay } from './mandate-idle-drift.ts';
import { resetCoalitionCrisisStreak } from './coalition-crisis.ts';
import { resetCoalitionRecoveryStreak } from './coalition-recovery.ts';
import { resetCoalitionVolatilityEvents, decrementCoalitionVolatilityEvents } from './coalition-volatility.ts';
import { resetCoalitionStabilizationStreak } from './coalition-stabilization.ts';
import { resetCoalitionLockInStreak } from './coalition-lock-in.ts';
import { resetCrossModuleSyncStreak } from '../integrations/strategic-cross-module-hooks.ts';
import { resetIntegratedCoalitionMaturityStreak } from './coalition-integrated-maturity.ts';
import { resetCoalitionStewardshipStreak } from './coalition-stewardship.ts';
import { resetCoalitionAnchoredGovernanceStreak } from './coalition-anchored-governance.ts';
import { resetCoalitionInstitutionalPermanenceStreak } from './coalition-institutional-permanence.ts';
import { resetCoalitionGenerationalContinuityStreak } from './coalition-generational-continuity.ts';
import { resetCoalitionCivilizationalEnduranceStreak } from './coalition-civilizational-endurance.ts';
import { resetCoalitionTranscendentLegacyStreak } from './coalition-transcendent-legacy.ts';
import { resetCoalitionSovereignContinuumStreak } from './coalition-sovereign-continuum.ts';
import { resetCoalitionEternalAscendanceStreak } from './coalition-eternal-ascendance.ts';
import { resetCoalitionInfinitePersistenceStreak } from './coalition-infinite-persistence.ts';
import { resetCoalitionPrimordialContinuityStreak } from './coalition-primordial-continuity.ts';
import { resetCoalitionAbsoluteSanctityStreak } from './coalition-absolute-sanctity.ts';
import { resetCoalitionUniversalImmortalityStreak } from './coalition-universal-immortality.ts';
import { resetCoalitionCosmicPerpetuityStreak } from './coalition-cosmic-perpetuity.ts';
import { resetCoalitionGalacticInfinityStreak } from './coalition-galactic-infinity.ts';
import { resetCoalitionStellarTranscendenceStreak } from './coalition-stellar-transcendence.ts';
import {
  scoreNationalPriorityAlignment,
  validateAction,
  validateChoiceOption,
} from './validation.ts';

import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';
import { createEmptyMandateProgress } from './strategic-mandate.ts';

export function createInitialStrategicState(day = 1): StrategicGameplayState {
  return {
    day,
    pendingDelayed: [],
    completedActionIds: [],
    journal: [],
    priorityMomentum: {},
    actionCooldowns: {},
    mandateProgress: createEmptyMandateProgress(),
    stakeholderSentiment: createDefaultStakeholderSentiment(),
    lastAlignedActionDay: day,
    coalitionCrisisStreakDays: 0,
    coalitionRecoveryStreakDays: 0,
    coalitionVolatilityEvents: 0,
    coalitionStabilizationStreakDays: 0,
    coalitionLockInStreakDays: 0,
    crossModuleSyncStreakDays: 0,
    integratedCoalitionMaturityStreakDays: 0,
    coalitionStewardshipStreakDays: 0,
    coalitionAnchoredGovernanceStreakDays: 0,
    coalitionInstitutionalPermanenceStreakDays: 0,
    coalitionGenerationalContinuityStreakDays: 0,
    coalitionCivilizationalEnduranceStreakDays: 0,
    coalitionTranscendentLegacyStreakDays: 0,
    coalitionSovereignContinuumStreakDays: 0,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
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
  const synergies =
    action.synergyEligible !== false
      ? detectStrategicSynergies(state, action, STRATEGIC_ACTION_CATALOG)
      : [];
  const synergyApproval = applySynergyApprovalBoost(synergies);

  if (alignment && alignment.band === 'strong') {
    contracts.government.applyPatch({
      approvalDelta: 1 + synergyApproval,
      ledgerNote: alignment.reason,
    });
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
  nextState = applyPriorityMomentum(nextState, action);
  nextState = advanceMandateOnAction(nextState, action);
  nextState = applyStakeholderReaction(nextState, action);
  if (action.alignedPriorities.length > 0) {
    nextState = touchLastAlignedActionDay(nextState, state.day);
  }
  if (action.cooldownDays && action.cooldownDays > 0) {
    nextState = startActionCooldown(nextState, action.id, action.cooldownDays);
  }
  if (action.id === 'sga_coalition_reconciliation_forum') {
    nextState = resetCoalitionCrisisStreak(nextState);
  }
  if (action.id === 'sga_coalition_emergency_compact') {
    nextState = resetCoalitionCrisisStreak(nextState);
  }
  if (action.id === 'sga_coalition_stability_dividend') {
    nextState = resetCoalitionRecoveryStreak(nextState);
  }
  if (action.id === 'sga_coalition_sustained_trust_charter') {
    nextState = resetCoalitionRecoveryStreak(nextState);
  }
  if (action.id === 'sga_coalition_volatility_review') {
    nextState = resetCoalitionVolatilityEvents(nextState);
  }
  if (action.id === 'sga_coalition_volatility_mediation') {
    nextState = decrementCoalitionVolatilityEvents(nextState);
  }
  if (action.id === 'sga_coalition_stabilization_accord') {
    nextState = resetCoalitionVolatilityEvents(nextState);
    nextState = resetCoalitionStabilizationStreak(nextState);
    nextState = resetCoalitionLockInStreak(nextState);
  }
  if (action.id === 'sga_coalition_lock_in_charter') {
    nextState = resetCoalitionLockInStreak(nextState);
  }
  if (action.id === 'sga_coalition_integrated_stabilization_review') {
    nextState = resetCrossModuleSyncStreak(nextState);
  }
  if (action.id === 'sga_coalition_integrated_maturity_compact') {
    nextState = resetIntegratedCoalitionMaturityStreak(nextState);
  }
  if (action.id === 'sga_coalition_resilience_endowment') {
    nextState = resetIntegratedCoalitionMaturityStreak(nextState);
  }
  if (action.id === 'sga_coalition_stewardship_charter') {
    nextState = resetCoalitionStewardshipStreak(nextState);
  }
  if (action.id === 'sga_coalition_anchored_trust_dividend') {
    nextState = resetCoalitionStewardshipStreak(nextState);
  }
  if (action.id === 'sga_coalition_anchored_governance_compact') {
    nextState = resetCoalitionAnchoredGovernanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_legacy_trust_endowment') {
    nextState = resetCoalitionAnchoredGovernanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_institutional_permanence_charter') {
    nextState = resetCoalitionInstitutionalPermanenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_succession_resilience_covenant') {
    nextState = resetCoalitionInstitutionalPermanenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_generational_continuity_charter') {
    nextState = resetCoalitionGenerationalContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_intergenerational_trust_endowment') {
    nextState = resetCoalitionGenerationalContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_civilizational_endurance_charter') {
    nextState = resetCoalitionCivilizationalEnduranceStreak(nextState);
  }
  if (action.id === 'sga_coalition_civilizational_heritage_covenant') {
    nextState = resetCoalitionCivilizationalEnduranceStreak(nextState);
  }
  if (action.id === 'sga_coalition_transcendent_legacy_charter') {
    nextState = resetCoalitionTranscendentLegacyStreak(nextState);
  }
  if (action.id === 'sga_coalition_transcendent_enduring_covenant') {
    nextState = resetCoalitionTranscendentLegacyStreak(nextState);
  }
  if (action.id === 'sga_coalition_sovereign_continuum_charter') {
    nextState = resetCoalitionSovereignContinuumStreak(nextState);
  }
  if (action.id === 'sga_coalition_sovereign_continuity_endowment') {
    nextState = resetCoalitionSovereignContinuumStreak(nextState);
  }
  if (action.id === 'sga_coalition_eternal_ascendance_charter') {
    nextState = resetCoalitionEternalAscendanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_eternal_continuity_covenant') {
    nextState = resetCoalitionEternalAscendanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_infinite_persistence_charter') {
    nextState = resetCoalitionInfinitePersistenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_infinite_continuity_accord') {
    nextState = resetCoalitionInfinitePersistenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_primordial_continuity_charter') {
    nextState = resetCoalitionPrimordialContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_primordial_continuity_endowment') {
    nextState = resetCoalitionPrimordialContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_absolute_sanctity_charter') {
    nextState = resetCoalitionAbsoluteSanctityStreak(nextState);
  }
  if (action.id === 'sga_coalition_absolute_continuity_pact') {
    nextState = resetCoalitionAbsoluteSanctityStreak(nextState);
  }
  if (action.id === 'sga_coalition_universal_immortality_charter') {
    nextState = resetCoalitionUniversalImmortalityStreak(nextState);
  }
  if (action.id === 'sga_coalition_universal_continuity_compact') {
    nextState = resetCoalitionUniversalImmortalityStreak(nextState);
  }
  if (action.id === 'sga_coalition_cosmic_perpetuity_charter') {
    nextState = resetCoalitionCosmicPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_cosmic_continuity_covenant') {
    nextState = resetCoalitionCosmicPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_galactic_infinity_charter') {
    nextState = resetCoalitionGalacticInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_galactic_continuity_endowment') {
    nextState = resetCoalitionGalacticInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_stellar_transcendence_charter') {
    nextState = resetCoalitionStellarTranscendenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_stellar_continuity_compact') {
    nextState = resetCoalitionStellarTranscendenceStreak(nextState);
  }

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
