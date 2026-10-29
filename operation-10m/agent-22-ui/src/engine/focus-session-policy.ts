import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { InterfaceExperienceLevel, PanelVisibilityResult, ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { computeProgressionCoverage } from './progression-coach.js';
import { resolveEvolvingPanelVisibility } from './resolve-panel-visibility.js';

const FOCUS_SUPPRESS_TAGS = new Set(['launcher', 'automation', 'diagnostics', 'strategic']);

export interface FocusSessionContext {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
}

export function shouldActivateFocusSession(ctx: FocusSessionContext): boolean {
  if (ctx.phase !== 'human_turn') return false;
  if (ctx.focusSessionSnoozedUntilDay && ctx.signals.gameDay < ctx.focusSessionSnoozedUntilDay) return false;
  const level = ctx.signals.interfaceLevel;
  if (level !== 'simple' && level !== 'guided') return false;
  if (ctx.signals.gameDay > 7) return false;
  const coverage = computeProgressionCoverage(ctx.signals, ctx.policy);
  return coverage.coverageRatio < 0.45;
}

export function focusSessionCoachCopy(ctx: FocusSessionContext): string {
  if (!shouldActivateFocusSession(ctx)) return '';
  return 'Focus session hides advanced launchers until you unlock more of the interface.';
}

export function applyFocusSessionToVisibility(
  panelId: string,
  base: PanelVisibilityResult,
  focusActive: boolean
): PanelVisibilityResult {
  if (!focusActive || base.state !== 'visible') return base;
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel || panel.essential) return base;
  const tags = panel.tags ?? [];
  if (!tags.some(t => FOCUS_SUPPRESS_TAGS.has(t))) return base;
  return {
    ...base,
    state: 'preview',
    reason: `${base.reason}|focus_session`,
  };
}

export function resolveEvolvingPanelVisibilityWithFocusSession(
  panelId: string,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  ctx: Omit<FocusSessionContext, 'signals' | 'policy'> & {
    signals?: ProgressionSignalSnapshot;
    policy?: EvolvingUiAccessPolicy;
  }
): PanelVisibilityResult {
  const sig = ctx.signals ?? signals;
  const pol = ctx.policy ?? policy;
  const base = resolveEvolvingPanelVisibility(panelId, sig, pol);
  const focusCtx: FocusSessionContext = {
    phase: ctx.phase,
    signals: sig,
    policy: pol,
    focusSessionSnoozedUntilDay: ctx.focusSessionSnoozedUntilDay,
  };
  return applyFocusSessionToVisibility(panelId, base, shouldActivateFocusSession(focusCtx));
}

export function snoozeFocusSessionUntilDay(currentDay: number, snoozeDays = 3): number {
  return Math.max(1, currentDay + snoozeDays);
}

export function listPanelsSuppressedByFocusSession(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  phase: V94StandardizedGamePhase,
  snoozedUntilDay?: number
): string[] {
  const focusCtx: FocusSessionContext = {
    phase,
    signals,
    policy,
    focusSessionSnoozedUntilDay: snoozedUntilDay,
  };
  if (!shouldActivateFocusSession(focusCtx)) return [];
  const suppressed: string[] = [];
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const before = resolveEvolvingPanelVisibility(id, signals, policy);
    const after = applyFocusSessionToVisibility(id, before, true);
    if (before.state === 'visible' && after.state === 'preview') suppressed.push(id);
  }
  return suppressed;
}
