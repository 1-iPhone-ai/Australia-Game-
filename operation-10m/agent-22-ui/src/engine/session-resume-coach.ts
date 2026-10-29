import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  createDefaultSessionUiMemory,
  suggestResumeNavTarget,
  type SessionUiMemory,
} from '../sim/session-ui-memory.js';
import { navSelectorForTarget } from './modal-focus-restoration.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export interface SessionResumeCoachPlan {
  shouldShow: boolean;
  navTarget: string | null;
  panelLabel: string | null;
  focusSelector: string | null;
  coachCopy: string | null;
}

export function buildSessionResumeCoachPlan(input: {
  memory?: SessionUiMemory;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  phaseAllowsResume?: boolean;
}): SessionResumeCoachPlan {
  const memory = input.memory ?? createDefaultSessionUiMemory();
  const navTarget = suggestResumeNavTarget(memory, input.signals, input.policy);
  const phaseOk = input.phaseAllowsResume ?? true;

  if (!phaseOk || !navTarget || !input.accessibility.keyboardNavigationHints) {
    return {
      shouldShow: false,
      navTarget: null,
      panelLabel: null,
      focusSelector: null,
      coachCopy: null,
    };
  }

  const panel = Object.values(EVOLVING_UI_PANEL_BY_ID).find(p => p.navTarget === navTarget);
  const panelLabel = panel?.label ?? navTarget;
  const focusSelector = navSelectorForTarget(navTarget);

  return {
    shouldShow: true,
    navTarget,
    panelLabel,
    focusSelector,
    coachCopy: `Resume where you left off — return to ${panelLabel}.`,
  };
}

export function sessionResumeSkipLinkLabel(plan: SessionResumeCoachPlan): string | null {
  if (!plan.shouldShow || !plan.panelLabel) return null;
  return `Skip to ${plan.panelLabel}`;
}
