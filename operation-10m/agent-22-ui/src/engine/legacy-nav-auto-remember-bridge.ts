import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import {
  auditLegacyNavTargets,
  type LegacyNavAuditEntry,
} from './legacy-nav-audit-coach.js';

export interface LegacyNavAutoRememberPlan {
  entries: LegacyNavAuditEntry[];
  panelIdsToRemember: string[];
  coachCopy: string | null;
}

export function buildLegacyNavAutoRememberPlan(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  persisted: EvolvingUiPersistedState
): LegacyNavAutoRememberPlan {
  const entries = auditLegacyNavTargets(signals, policy);
  const remembered = new Set(persisted.rememberedPanelIds ?? []);
  const panelIdsToRemember: string[] = [];

  for (const entry of entries) {
    if (!entry.hasPatch || !entry.progressionWouldHide) continue;
    for (const panelId of entry.panelIds) {
      if (remembered.has(panelId)) continue;
      panelIdsToRemember.push(panelId);
    }
  }

  const unique = [...new Set(panelIdsToRemember)];
  let coachCopy: string | null = null;
  if (unique.length) {
    coachCopy = `${unique.length} legacy nav panels can be remembered so deep links stay reachable.`;
  }

  return { entries, panelIdsToRemember: unique, coachCopy };
}

export interface LegacyNavAutoRememberResult {
  applied: boolean;
  rememberedCount: number;
  persisted: EvolvingUiPersistedState;
  coachCopy: string | null;
}

/** Merges remembered panel ids for progression-hidden legacy nav targets when host opts in. */
export function applyLegacyNavAutoRemember(
  persisted: EvolvingUiPersistedState,
  plan: LegacyNavAutoRememberPlan,
  options?: { autoRemember?: boolean }
): LegacyNavAutoRememberResult {
  const autoRemember = options?.autoRemember !== false;

  if (!plan.panelIdsToRemember.length) {
    return { applied: false, rememberedCount: 0, persisted, coachCopy: plan.coachCopy };
  }

  if (!autoRemember) {
    return {
      applied: false,
      rememberedCount: 0,
      persisted,
      coachCopy: plan.coachCopy,
    };
  }

  const merged = [
    ...new Set([...(persisted.rememberedPanelIds ?? []), ...plan.panelIdsToRemember]),
  ];

  return {
    applied: true,
    rememberedCount: plan.panelIdsToRemember.length,
    persisted: { ...persisted, rememberedPanelIds: merged },
    coachCopy: `Remembered ${plan.panelIdsToRemember.length} legacy nav panels for deep-link access.`,
  };
}
