import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  migrateO10mModesPersistedState,
  sanitizeO10mModesPersistedState,
  validateO10mModesPersistedForLoad,
} from './save-format.js';
import type {
  O10mMilestoneProgress,
  O10mModesMergeResult,
  O10mModesPersistedDiff,
  O10mModesPersistedState,
  O10mModesReconcileContext,
  O10mModesSaveKind,
} from './types.js';
import { sanitizeCampaignSlots } from './save-format-campaign.js';
import { mergeReplayLedgers } from './save-format-marathon.js';
import { mergeCatalogUnlockTokens } from './save-format-gauntlet.js';
import { mergeObjectiveProgressOnImport } from './save-format-objective-sync.js';

const FINGERPRINT_KEYS: Array<keyof O10mModesPersistedState> = [
  'baseMode',
  'scenarioId',
  'chainProgress',
  'challengeModeIds',
  'sandboxProfileId',
  'milestones',
  'completedChainIds',
  'objectiveProgress',
  'campaignSlots',
  'activeCampaignSlotId',
  'challengeStreak',
  'marathonQueue',
  'replayLedger',
  'gauntletSession',
  'catalogUnlockTokens',
  'relaySession',
  'circuitSession',
  'expeditionSession',
  'odysseySession',
  'pilgrimageSession',
  'caravanSession',
  'voyageSession',
  'siegeSession',
  'convoySession',
  'escortSession',
  'extractionSession',
  'subjectSession',
  'witnessSession',
  'tribunalSession',
  'indictmentSession',
  'appealSession',
  'clemencySession',
  'pardonSession',
  'amnestySession',
  'reprieveSession',
  'paroleSession',
  'probationSession',
  'commutationSession',
  'acquittalSession',
  'exonerationSession',
  'expungementSession',
  'vacaturSession',
  'remandSession',
  'reversalSession',
  'annulmentSession',
  'reinstatementSession',
];

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

/** Browser-safe fingerprint (no Node crypto) for assembly chunk. */
export function hashO10mModesPayload(payload: string): string {
  let h = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function computeO10mModesIntegrityFingerprint(state: O10mModesPersistedState): string {
  const payload: Record<string, unknown> = {};
  for (const key of FINGERPRINT_KEYS) {
    payload[key] = state[key];
  }
  payload.schemaVersion = state.schemaVersion;
  return hashO10mModesPayload(stableStringify(payload));
}

export function sealO10mModesPersistedState(
  state: O10mModesPersistedState,
  saveKind: O10mModesSaveKind = 'manual',
): O10mModesPersistedState {
  const sealed: O10mModesPersistedState = {
    ...state,
    schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
    saveKind,
    sessionId: state.sessionId || `o10m_sess_${state.updatedAtTurn}_${state.scenarioId || 'none'}`,
  };
  return {
    ...sealed,
    integrityFingerprint: computeO10mModesIntegrityFingerprint(sealed),
  };
}

export function verifyO10mModesIntegrity(state: O10mModesPersistedState): boolean {
  if (!state.integrityFingerprint) return true;
  return state.integrityFingerprint === computeO10mModesIntegrityFingerprint({ ...state, integrityFingerprint: undefined });
}

function mergeMilestones(a: O10mMilestoneProgress[], b: O10mMilestoneProgress[]): O10mMilestoneProgress[] {
  const map = new Map<string, O10mMilestoneProgress>();
  for (const m of [...a, ...b]) {
    const prev = map.get(m.milestoneId);
    if (!prev || (m.unlocked && !prev.unlocked)) map.set(m.milestoneId, m);
    else if (m.unlocked && prev.unlocked) {
      map.set(m.milestoneId, {
        ...prev,
        unlockedAtRunCount: Math.min(prev.unlockedAtRunCount || 999, m.unlockedAtRunCount || 999),
      });
    }
  }
  return [...map.values()].sort((x, y) => x.milestoneId.localeCompare(y.milestoneId));
}

export function mergeO10mModesPersistedStates(
  primary: O10mModesPersistedState,
  secondary: O10mModesPersistedState,
  strategy: 'prefer_newest_turn' | 'prefer_primary' | 'union_milestones' = 'prefer_newest_turn',
): O10mModesMergeResult {
  const warnings: string[] = [];
  let base = strategy === 'prefer_primary' ? primary : secondary.updatedAtTurn > primary.updatedAtTurn ? secondary : primary;
  const other = base === primary ? secondary : primary;

  if (base.scenarioId && other.scenarioId && base.scenarioId !== other.scenarioId) {
    warnings.push(`Merged saves disagree on scenarioId (${base.scenarioId} vs ${other.scenarioId}); kept newer turn.`);
  }

  if (strategy === 'union_milestones') {
    base = {
      ...base,
      milestones: mergeMilestones(primary.milestones, secondary.milestones),
      completedChainIds: [...new Set([...primary.completedChainIds, ...secondary.completedChainIds])].sort(),
      recentRuns: [...primary.recentRuns, ...secondary.recentRuns].slice(-24),
      objectiveProgress: mergeObjectiveProgressOnImport(
        primary.objectiveProgress ?? [],
        secondary.objectiveProgress ?? [],
      ),
      campaignSlots: sanitizeCampaignSlots([...(primary.campaignSlots ?? []), ...(secondary.campaignSlots ?? [])]),
      replayLedger: mergeReplayLedgers(primary.replayLedger ?? [], secondary.replayLedger ?? []),
      catalogUnlockTokens: mergeCatalogUnlockTokens(
        primary.catalogUnlockTokens ?? [],
        secondary.catalogUnlockTokens ?? [],
      ),
    };
  }

  const merged = sealO10mModesPersistedState(
    {
      ...base,
      challengeModeIds: base.challengeModeIds.length ? base.challengeModeIds : other.challengeModeIds,
      sandboxProfileId: base.sandboxProfileId ?? other.sandboxProfileId,
      sandboxKnobs: Object.keys(base.sandboxKnobs).length ? base.sandboxKnobs : other.sandboxKnobs,
    },
    base.saveKind ?? 'manual',
  );

  return { merged, warnings };
}

export function reconcileO10mModesOnGameLoad(
  state: O10mModesPersistedState,
  ctx: O10mModesReconcileContext,
): { state: O10mModesPersistedState; warnings: string[] } {
  const warnings: string[] = [];
  let next: O10mModesPersistedState = { ...state, updatedAtDay: ctx.day };

  if (ctx.turn < state.updatedAtTurn) {
    warnings.push('Live turn is behind persisted o10mModesProgress; possible reload of older snapshot.');
  }

  if (ctx.liveBaseMode && ctx.liveBaseMode !== state.baseMode) {
    warnings.push(`Live baseMode ${ctx.liveBaseMode} differs from persisted ${state.baseMode}.`);
    next = { ...next, baseMode: ctx.liveBaseMode };
  }

  if (ctx.liveScenarioId && state.scenarioId && ctx.liveScenarioId !== state.scenarioId) {
    warnings.push(`Live scenarioId ${ctx.liveScenarioId} differs from persisted ${state.scenarioId}.`);
    next = { ...next, scenarioId: ctx.liveScenarioId };
  }

  next = sealO10mModesPersistedState({ ...next, updatedAtTurn: Math.max(state.updatedAtTurn, ctx.turn) }, state.saveKind ?? 'manual');
  return { state: next, warnings };
}

export function diffO10mModesPersisted(before: O10mModesPersistedState, after: O10mModesPersistedState): O10mModesPersistedDiff {
  const changedFields: string[] = [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)] as Array<keyof O10mModesPersistedState>);
  for (const key of keys) {
    if (stableStringify(before[key]) !== stableStringify(after[key])) changedFields.push(String(key));
  }
  return { changedFields: changedFields.sort() };
}

export function exportO10mModesProgressJson(state: O10mModesPersistedState): string {
  return JSON.stringify(sealO10mModesPersistedState(state));
}

export function importO10mModesProgressJson(raw: string): { state: O10mModesPersistedState | null; errors: string[] } {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateO10mModesPersistedState(parsed);
    const validation = validateO10mModesPersistedForLoad(migrated);
    if (!validation.ok) return { state: null, errors: validation.errors };
    if (!verifyO10mModesIntegrity(migrated)) {
      return { state: null, errors: ['Integrity fingerprint mismatch on import.'] };
    }
    return { state: migrated, errors: validation.warnings };
  } catch {
    return { state: null, errors: ['Invalid JSON for o10mModesProgress import.'] };
  }
}

export function prepareO10mModesForAutosave(state: O10mModesPersistedState, turn: number, day: number): O10mModesPersistedState {
  return sealO10mModesPersistedState({ ...state, updatedAtTurn: turn, updatedAtDay: day }, 'autosave');
}

export function prepareO10mModesCheckpoint(state: O10mModesPersistedState, turn: number, day: number): O10mModesPersistedState {
  return sealO10mModesPersistedState({ ...state, updatedAtTurn: turn, updatedAtDay: day }, 'checkpoint');
}
