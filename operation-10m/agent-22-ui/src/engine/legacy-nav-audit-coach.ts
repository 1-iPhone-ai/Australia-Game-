import { resolveIntentNavToUiPatch } from './legacy-access.js';
import { listPanelsForNavTarget } from '../registry/panel-definitions.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import { resolveEvolvingPanelVisibility } from './resolve-panel-visibility.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';

export const AUDITED_LEGACY_NAV_TARGETS = [
  'map',
  'market',
  'workshop',
  'contracts',
  'loans',
  'help',
  'settings',
  'diagnostics',
  'replay',
  'unknown_target',
] as const;

export interface LegacyNavAuditEntry {
  target: string;
  hasPatch: boolean;
  panelIds: string[];
  progressionWouldHide: boolean;
}

export function auditLegacyNavTargets(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): LegacyNavAuditEntry[] {
  return AUDITED_LEGACY_NAV_TARGETS.map(target => {
    const patch = resolveIntentNavToUiPatch(target);
    const panels = listPanelsForNavTarget(target);
    const progressionWouldHide =
      panels.length > 0 &&
      panels.every(p => resolveEvolvingPanelVisibility(p.id, signals, policy).state === 'hidden');

    return {
      target,
      hasPatch: Object.keys(patch).length > 0,
      panelIds: panels.map(p => p.id),
      progressionWouldHide,
    };
  });
}

export function legacyNavAuditCoachCopy(entries: LegacyNavAuditEntry[]): string | null {
  const missing = entries.filter(e => !e.hasPatch);
  const hidden = entries.filter(e => e.hasPatch && e.progressionWouldHide);
  if (missing.length) {
    return `${missing.length} legacy nav targets lack UI patches — deep links may noop.`;
  }
  if (hidden.length) {
    return `${hidden.length} legacy nav targets resolve but panels stay hidden by progression.`;
  }
  return null;
}

export function countLegacyNavPatchCoverage(entries: LegacyNavAuditEntry[]): number {
  return entries.filter(e => e.hasPatch).length;
}
