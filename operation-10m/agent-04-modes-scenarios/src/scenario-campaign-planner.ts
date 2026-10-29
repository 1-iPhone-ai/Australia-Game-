import { getO10mScenarioChain } from './scenario-chains.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import { sanitizeCampaignSlots } from './save-format-campaign.js';
import {
  getMarathonScenarioAtCursor,
  sanitizeMarathonQueue,
} from './save-format-marathon.js';
import { objectiveProgressCompletionRatio } from './save-format-objective-sync.js';
import type { O10mCampaignPlan, O10mModesPersistedState } from './types.js';

export function planNextCampaignAction(state: O10mModesPersistedState): O10mCampaignPlan {
  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  const marathonScenario = getMarathonScenarioAtCursor(marathon);
  if (marathon && marathon.active && marathonScenario) {
    return {
      kind: 'marathon_step',
      scenarioId: marathonScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      marathonQueueId: marathon.queueId,
      marathonCursor: marathon.cursor,
      reason: `Marathon "${marathon.label}" step ${marathon.cursor + 1}/${marathon.scenarioIds.length}.`,
    };
  }

  if (state.activeCampaignSlotId) {
    const slot = sanitizeCampaignSlots(state.campaignSlots).find(s => s.slotId === state.activeCampaignSlotId);
    if (slot?.scenarioId) {
      return {
        kind: 'slot_resume',
        scenarioId: slot.scenarioId,
        chainId: slot.chainId,
        chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
        slotId: slot.slotId,
        marathonQueueId: null,
        marathonCursor: null,
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
        marathonQueueId: null,
        marathonCursor: null,
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
      marathonQueueId: null,
      marathonCursor: null,
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
    marathonQueueId: null,
    marathonCursor: null,
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
  marathonActive: boolean;
  replayTracked: number;
  nextPlan: O10mCampaignPlan;
} {
  const nextPlan = planNextCampaignAction(state);
  const chain = state.chainProgress ? getO10mScenarioChain(state.chainProgress.chainId) : undefined;
  const recentVictories = state.recentRuns.filter(r => r.primaryVictory).length;
  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  return {
    completedChains: state.completedChainIds.length,
    recentVictories,
    activeChainTitle: chain?.title ?? null,
    marathonActive: marathon?.active === true,
    replayTracked: (state.replayLedger ?? []).length,
    nextPlan,
  };
}
