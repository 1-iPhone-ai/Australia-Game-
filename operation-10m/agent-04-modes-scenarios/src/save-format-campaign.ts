import { getO10mScenarioChain } from './scenario-chains.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import { isCanonicalGameModeSelection } from './canonical-modes.js';
import type {
  GameModeSelection,
  O10mCampaignSlot,
  O10mChallengeStreak,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_CAMPAIGN_SLOT_CAP = 4;

export function createEmptyChallengeStreak(): O10mChallengeStreak {
  return { current: 0, best: 0, lastScenarioId: null };
}

function sanitizeSlot(raw: unknown): O10mCampaignSlot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const slotId = typeof o.slotId === 'string' && o.slotId.startsWith('o10m_slot_') ? o.slotId : null;
  if (!slotId) return null;
  const baseModeRaw = o.baseMode;
  const baseMode = isCanonicalGameModeSelection(baseModeRaw) ? baseModeRaw : 'scenario';
  const scenarioId = typeof o.scenarioId === 'string' && o.scenarioId.startsWith('o10m_') ? o.scenarioId : null;
  const chainId =
    typeof o.chainId === 'string' && o.chainId.startsWith('o10m_chain_') ? o.chainId : null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 64) : slotId;
  const pinnedAtTurn = typeof o.pinnedAtTurn === 'number' && Number.isFinite(o.pinnedAtTurn) ? o.pinnedAtTurn : 0;
  return { slotId, label, baseMode, scenarioId, chainId, pinnedAtTurn };
}

export function sanitizeCampaignSlots(raw: unknown): O10mCampaignSlot[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeSlot)
    .filter((s): s is O10mCampaignSlot => s !== null)
    .slice(0, O10M_CAMPAIGN_SLOT_CAP);
}

export function sanitizeChallengeStreak(raw: unknown): O10mChallengeStreak {
  if (!raw || typeof raw !== 'object') return createEmptyChallengeStreak();
  const o = raw as Record<string, unknown>;
  const current = typeof o.current === 'number' && o.current >= 0 ? Math.floor(o.current) : 0;
  const best = typeof o.best === 'number' && o.best >= 0 ? Math.floor(o.best) : 0;
  const lastScenarioId =
    typeof o.lastScenarioId === 'string' && o.lastScenarioId.startsWith('o10m_') ? o.lastScenarioId : null;
  return { current, best: Math.max(best, current), lastScenarioId };
}

export function pinCampaignSlot(
  state: O10mModesPersistedState,
  params: {
    slotId: string;
    label?: string;
    baseMode?: GameModeSelection;
    scenarioId?: string | null;
    chainId?: string | null;
    turn: number;
  },
): { state: O10mModesPersistedState; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.slotId.startsWith('o10m_slot_')) {
    return { state, warnings: ['Campaign slot ids must start with o10m_slot_.'] };
  }
  const baseMode = params.baseMode ?? state.baseMode;
  const scenarioId = params.scenarioId ?? state.scenarioId;
  if (scenarioId && !findO10mScenario(scenarioId)) {
    warnings.push(`Pinned unknown scenario ${scenarioId}.`);
  }
  if (params.chainId && !getO10mScenarioChain(params.chainId)) {
    warnings.push(`Pinned unknown chain ${params.chainId}.`);
  }

  const slot: O10mCampaignSlot = {
    slotId: params.slotId,
    label: params.label ?? params.slotId.replace('o10m_slot_', '').replace(/_/g, ' '),
    baseMode,
    scenarioId,
    chainId: params.chainId ?? state.chainProgress?.chainId ?? null,
    pinnedAtTurn: params.turn,
  };

  const slots = sanitizeCampaignSlots(state.campaignSlots).filter(s => s.slotId !== slot.slotId);
  slots.push(slot);
  slots.sort((a, b) => a.pinnedAtTurn - b.pinnedAtTurn);
  const trimmed = slots.slice(-O10M_CAMPAIGN_SLOT_CAP);

  return {
    state: {
      ...state,
      campaignSlots: trimmed,
      activeCampaignSlotId: params.slotId,
    },
    warnings,
  };
}

export function unpinCampaignSlot(
  state: O10mModesPersistedState,
  slotId: string,
): O10mModesPersistedState {
  const campaignSlots = sanitizeCampaignSlots(state.campaignSlots).filter(s => s.slotId !== slotId);
  const activeCampaignSlotId = state.activeCampaignSlotId === slotId ? null : state.activeCampaignSlotId;
  return { ...state, campaignSlots, activeCampaignSlotId };
}

export function applyCampaignSlotToState(
  state: O10mModesPersistedState,
  slotId: string,
): { state: O10mModesPersistedState; warnings: string[] } {
  const slot = sanitizeCampaignSlots(state.campaignSlots).find(s => s.slotId === slotId);
  if (!slot) return { state, warnings: [`Unknown campaign slot ${slotId}.`] };

  const warnings: string[] = [];
  let next: O10mModesPersistedState = {
    ...state,
    baseMode: slot.baseMode,
    scenarioId: slot.scenarioId,
    activeCampaignSlotId: slotId,
  };

  if (slot.chainId) {
    const chain = getO10mScenarioChain(slot.chainId);
    if (!chain) {
      warnings.push(`Slot chain ${slot.chainId} is no longer registered.`);
    } else if (slot.scenarioId) {
      const step = chain.steps.find(s => s.scenarioId === slot.scenarioId);
      if (!step) warnings.push(`Scenario ${slot.scenarioId} is not a step on chain ${slot.chainId}.`);
    }
  }

  return { state: next, warnings };
}

export function updateChallengeStreakAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const prev = sanitizeChallengeStreak(state.challengeStreak);
  const onChallenge = run.challengeModeIds.length > 0;
  if (!onChallenge) {
    return { ...state, challengeStreak: { ...prev, current: 0, lastScenarioId: run.scenarioId } };
  }
  const current = run.primaryVictory ? prev.current + 1 : 0;
  const best = Math.max(prev.best, current);
  return {
    ...state,
    challengeStreak: {
      current,
      best,
      lastScenarioId: run.scenarioId,
    },
  };
}

export function summarizeCampaignSlots(state: O10mModesPersistedState): {
  slotCount: number;
  activeSlotId: string | null;
  streakCurrent: number;
  streakBest: number;
} {
  const streak = sanitizeChallengeStreak(state.challengeStreak);
  return {
    slotCount: sanitizeCampaignSlots(state.campaignSlots).length,
    activeSlotId: state.activeCampaignSlotId ?? null,
    streakCurrent: streak.current,
    streakBest: streak.best,
  };
}
