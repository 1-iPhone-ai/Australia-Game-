import {
  applyPlayerNationalStewardOverride,
  createDefaultAutonomousIdleNationalPersisted,
  planNationalStewardTurnStep,
  resolveO10AutomationPath,
  sanitizeAutonomousIdleNationalPersisted,
  tickIdleNationalStewardTelemetry,
  mapAutomationPathToStewardMode,
} from './national-steward.js';
import type { NationalStewardPersisted } from './types.js';

export interface NationalStewardBridgeHooks {
  onBeforeCoPilotLiveStep?: (input: {
    gameState: Record<string, unknown>;
    settings: Record<string, unknown>;
    persisted: NationalStewardPersisted | null;
  }) => NationalStewardPersisted | null;
  onAfterAutoModeEvaluation?: (input: {
    gameState: Record<string, unknown>;
    settings: Record<string, unknown>;
    persisted: NationalStewardPersisted | null;
  }) => NationalStewardPersisted | null;
  onPlayerInterruptTakeover?: (input: {
    persisted: NationalStewardPersisted | null;
    turn: number;
  }) => NationalStewardPersisted;
}

export function createDefaultNationalStewardBridgeHooks(): NationalStewardBridgeHooks {
  return {
    onBeforeCoPilotLiveStep: ({ gameState, settings, persisted }) => {
      const base = sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted();
      const ticked = tickIdleNationalStewardTelemetry(base, {
        msSinceLastHumanInput: base.idleTelemetry.msSinceLastHumanInput,
        msSinceLastCommittedAction: base.idleTelemetry.msSinceLastCommittedAction,
        humanCommittedThisTurn: false,
        turn: Number(gameState?.turnCounter || 1),
      });
      const { persisted: planned } = planNationalStewardTurnStep(gameState, settings, ticked);
      return planned;
    },
    onAfterAutoModeEvaluation: ({ settings, persisted }) => {
      const base = sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted();
      if (!settings?.autoModeEnabled) return base;
      const path = resolveO10AutomationPath({
        autoModeEnabled: true,
        autoModePermission: (settings.autoModeSettings as { permissionMode?: string })?.permissionMode as
          | 'full_auto'
          | 'recommend_only'
          | undefined,
        stewardEnabled: base.enabled,
        playerControlMode: settings.playerControlMode as 'manual' | undefined,
      });
      return { ...base, automationPath: path, operatingMode: mapAutomationPathToStewardMode(path) };
    },
    onPlayerInterruptTakeover: ({ persisted, turn }) =>
      applyPlayerNationalStewardOverride(
        sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted(),
        { action: 'latch_manual', reason: 'Co-Pilot takeover interrupted — manual control.' },
        turn
      ),
  };
}

export function mergeAutonomousIdleNationalIntoGameState(
  gameState: Record<string, unknown>,
  persisted: NationalStewardPersisted | null | undefined
): Record<string, unknown> {
  const sanitized = sanitizeAutonomousIdleNationalPersisted(persisted);
  if (!sanitized) return gameState;
  return { ...gameState, autonomousIdleNational: sanitized };
}
