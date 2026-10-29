import { getO10mScenarioChain } from './scenario-chains.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import { sanitizeCampaignSlots } from './save-format-campaign.js';
import {
  getGauntletScenarioAtCursor,
  gauntletSessionSummary,
  sanitizeCatalogUnlockTokens,
  sanitizeGauntletSession,
} from './save-format-gauntlet.js';
import {
  getMarathonScenarioAtCursor,
  sanitizeMarathonQueue,
} from './save-format-marathon.js';
import {
  getRelayScenarioAtCursor,
  relaySessionSummary,
  sanitizeRelaySession,
} from './save-format-relay.js';
import { objectiveProgressCompletionRatio } from './save-format-objective-sync.js';
import type { O10mCampaignPlan, O10mModesPersistedState } from './types.js';

const emptyQueuePlan = {
  marathonQueueId: null as string | null,
  marathonCursor: null as number | null,
  gauntletId: null as string | null,
  gauntletCursor: null as number | null,
  gauntletLives: null as number | null,
  relayId: null as string | null,
  relayCursor: null as number | null,
  relayCarryMoney: null as number | null,
};

export function planNextCampaignAction(state: O10mModesPersistedState): O10mCampaignPlan {
  const relay = sanitizeRelaySession(state.relaySession);
  const relayScenario = getRelayScenarioAtCursor(relay);
  if (relay && relay.active && relayScenario) {
    const carryMoney = relay.legCarry.startingMoneyDelta ?? 0;
    return {
      kind: 'relay_step',
      scenarioId: relayScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      relayId: relay.relayId,
      relayCursor: relay.cursor,
      relayCarryMoney: carryMoney,
      reason: `Relay "${relay.label}" leg ${relay.cursor + 1}/${relay.scenarioIds.length} (+$${carryMoney} carry).`,
    };
  }

  const gauntlet = sanitizeGauntletSession(state.gauntletSession);
  const gauntletScenario = getGauntletScenarioAtCursor(gauntlet);
  if (gauntlet && gauntlet.active && gauntletScenario) {
    return {
      kind: 'gauntlet_step',
      scenarioId: gauntletScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      marathonQueueId: null,
      marathonCursor: null,
      gauntletId: gauntlet.gauntletId,
      gauntletCursor: gauntlet.cursor,
      gauntletLives: gauntlet.livesRemaining,
      relayId: null,
      relayCursor: null,
      relayCarryMoney: null,
      reason: `Gauntlet "${gauntlet.label}" step ${gauntlet.cursor + 1}/${gauntlet.scenarioIds.length} (${gauntlet.livesRemaining} lives).`,
    };
  }

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
      gauntletId: null,
      gauntletCursor: null,
      gauntletLives: null,
      relayId: null,
      relayCursor: null,
      relayCarryMoney: null,
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
        ...emptyQueuePlan,
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
        ...emptyQueuePlan,
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
      ...emptyQueuePlan,
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
    ...emptyQueuePlan,
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
  gauntletActive: boolean;
  relayActive: boolean;
  replayTracked: number;
  unlockTokens: number;
  nextPlan: O10mCampaignPlan;
} {
  const nextPlan = planNextCampaignAction(state);
  const chain = state.chainProgress ? getO10mScenarioChain(state.chainProgress.chainId) : undefined;
  const recentVictories = state.recentRuns.filter(r => r.primaryVictory).length;
  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  const gauntlet = gauntletSessionSummary(state);
  const relay = relaySessionSummary(state);
  const tokens = sanitizeCatalogUnlockTokens(state.catalogUnlockTokens);
  return {
    completedChains: state.completedChainIds.length,
    recentVictories,
    activeChainTitle: chain?.title ?? null,
    marathonActive: marathon?.active === true,
    gauntletActive: gauntlet.active,
    relayActive: relay.active,
    replayTracked: (state.replayLedger ?? []).length,
    unlockTokens: tokens.length,
    nextPlan,
  };
}
