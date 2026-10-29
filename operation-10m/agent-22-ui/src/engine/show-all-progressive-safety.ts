import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { computeProgressionCoverage } from './progression-coach.js';
import { listPhasesThatSuppressCategory } from './phase-panel-policy.js';

export interface ShowAllOverrideSafetyAssessment {
  overrideActive: boolean;
  riskyPhase: boolean;
  suppressedCategoriesDuringPhase: string[];
  coachCopy: string | null;
}

export function evaluateShowAllOverrideSafety(input: {
  persisted: EvolvingUiPersistedState;
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
}): ShowAllOverrideSafetyAssessment {
  const overrideActive =
    input.persisted.showAllPanelsOverride === true || input.policy.showAllPanelsOverride === true;
  const coverage = computeProgressionCoverage(input.signals, input.policy);
  const riskyPhase = ['save_load', 'main_menu', 'setup'].includes(input.phase);
  const suppressedCategoriesDuringPhase = ['economy', 'strategic', 'regional'].filter(cat =>
    listPhasesThatSuppressCategory(cat).includes(input.phase)
  );

  let coachCopy: string | null = null;
  if (overrideActive && riskyPhase) {
    coachCopy = 'Show-all override is on — some panels stay in preview during setup and menu phases.';
  } else if (overrideActive && coverage.preview > coverage.visible) {
    coachCopy = 'Show-all override reveals previews, but phase rules still gate full visibility.';
  }

  return {
    overrideActive,
    riskyPhase,
    suppressedCategoriesDuringPhase,
    coachCopy,
  };
}
