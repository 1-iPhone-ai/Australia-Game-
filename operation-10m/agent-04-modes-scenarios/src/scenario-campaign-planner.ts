import { getO10mScenarioChain } from './scenario-chains.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import { sanitizeCampaignSlots } from './save-format-campaign.js';
import { objectiveProgressCompletionRatio } from './save-format-objective-sync.js';
import type { O10mCampaignPlan, O10mModesPersistedState } from './types.js';

export function planNextCampaignAction(state: O10mModesPersistedState): O10mCampaignPlan {
  if (state.activeCampaignSlotId) {
    const slot = sanitizeCampaignSlots(state.campaignSlots).find(s => s.slotId === state.activeCampaignSlotId);
    if (slot?.scenarioId) {
      return {
        kind: 'slot_resume',
        scenarioId: slot.scenarioId,
        chainId: slot.chainId,
        chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
        slotId: slot.slotId,
        reason: `Resume pinned slot "${slot.label}".`,
      };
    }
  }

  if (state.chainProgress && !state.chainProgress.chainCompleted) {
    const chain = getO10mScenarioChain(state.chainProgress.chainId);
    const step = chain?.steps.find(s => s.stepIndex === state.chainProgress!.activeStepIndex);
    if (step) {
      return {
        kind: 'chain_step',
        scenarioId: step.scenarioId,
        chainId: state.chainProgress.chainId,
        chainStepIndex: step.stepIndex,
        slotId: null,
        reason: `Continue chain "${chain?.title ?? state.chainProgress.chainId}" at step ${step.stepIndex + 1}.`,
      };
    }
  }

  if (state.scenarioId && findO10mScenario(state.scenarioId)) {
    const ratio = objectiveProgressCompletionRatio(state, state.scenarioId);
    return {
      kind: 'free_play',
      scenarioId: state.scenarioId,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: null,
      reason:
        ratio > 0 && ratio < 1
          ? `Resume in-progress scenario (${Math.round(ratio * 100)}% objectives captured).`
          : 'Continue last selected scenario.',
    };
  }

  return {
    kind: 'free_play',
    scenarioId: null,
    chainId: null,
    chainStepIndex: null,
    slotId: null,
    reason: 'No active chain, slot, or scenario — pick from catalog.',
  };
}

export function rankCampaignSlotsByRecency(state: O10mModesPersistedState): string[] {
  return sanitizeCampaignSlots(state.campaignSlots)
    .sort((a, b) => b.pinnedAtTurn - a.pinnedAtTurn)
    .map(s => s.slotId);
}

export function campaignProgressSummary(state: O10mModesPersistedState): {
  completedChains: number;
  recentVictories: number;
  activeChainTitle: string | null;
  nextPlan: O10mCampaignPlan;
} {
  const nextPlan = planNextCampaignAction(state);
  const chain = state.chainProgress ? getO10mScenarioChain(state.chainProgress.chainId) : undefined;
  const recentVictories = state.recentRuns.filter(r => r.primaryVictory).length;
  return {
    completedChains: state.completedChainIds.length,
    recentVictories,
    activeChainTitle: chain?.title ?? null,
    nextPlan,
  };
}
