import { listPanelsForNavTarget } from '../registry/panel-definitions.js';
import type { EvolvingUiAccessPolicy, LegacyAccessResult, LegacyNavRequest } from '../types/access-policy.js';

/** Mirrors V9.4 resolveIntentNavToUiPatch targets (standalone copy for module tests). */
export function resolveIntentNavToUiPatch(target: string): Record<string, boolean | string> {
  switch (target) {
    case 'workshop':
      return { showWorkshop: true };
    case 'market':
      return { showMarket: true };
    case 'resource_market':
      return { showResourceMarket: true };
    case 'map':
      return { showMap: true };
    case 'travel':
      return { showTravelModal: true, showMap: true };
    case 'contracts':
      return { showRegionalContractsModal: true };
    case 'shop':
      return { showShop: true };
    case 'investments':
      return { showInvestments: true };
    case 'expeditions':
      return { showExpeditionsRelicsModal: true };
    case 'infrastructure':
      return { showInfrastructureProjectsModal: true };
    case 'settings':
    case 'assistant_advanced':
      return { showSettings: true, settingsActiveTab: 'aiTeams' };
    case 'ask_game':
      return { showAskGameAi: true };
    case 'ledger':
      return { showGameActivityLedgerDashboard: true };
    case 'replay':
      return { showReplayViewer: true, showSettings: true, settingsActiveTab: 'replayDiag' };
    case 'diagnostics':
      return { showSettings: true, settingsActiveTab: 'replayDiag', showAutoModeDiagnosticsDrawer: true };
    case 'challenges':
      return { showChallenges: true };
    case 'progress':
      return { showProgress: true };
    case 'loans':
      return { showAdvancedLoans: true };
    case 'governance':
      return { showSettings: true, settingsActiveTab: 'oversight' };
    case 'sabotage':
      return { showSabotage: true };
    case 'help':
      return { showHelp: true };
    case 'automation':
      return { showSettings: true, settingsActiveTab: 'automation' };
    case 'diplomacy':
      return { showAiRivalryModal: true };
    default:
      return {};
  }
}

/**
 * Preserve existing UI access: navigation always returns a patch when canonical behavior does.
 * Progression gating must not block this path when preserveLegacyNavPatches is true.
 */
export function resolveLegacyUiAccess(
  request: LegacyNavRequest,
  policy: EvolvingUiAccessPolicy
): LegacyAccessResult {
  const uiPatch = resolveIntentNavToUiPatch(request.target);
  const hasPatch = Object.keys(uiPatch).length > 0;
  if (!hasPatch) {
    return { allowed: false, uiPatch: {} };
  }
  if (policy.preserveLegacyNavPatches) {
    const panels = listPanelsForNavTarget(request.target);
    const label = panels[0]?.label ?? request.target;
    return {
      allowed: true,
      uiPatch,
      announce: `Opening ${label}`,
    };
  }
  return { allowed: true, uiPatch };
}

export function rememberPanelOpen(panelId: string, policy: EvolvingUiAccessPolicy): EvolvingUiAccessPolicy {
  if (policy.rememberedPanelIds.includes(panelId)) return policy;
  return {
    ...policy,
    rememberedPanelIds: [...policy.rememberedPanelIds, panelId],
  };
}
