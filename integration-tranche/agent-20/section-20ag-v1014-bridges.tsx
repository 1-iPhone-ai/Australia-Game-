// SECTION 20AG — Agent 20 bridge hooks (merge adjacent to core 20AG block)
// Wires national steward planning into existing V9.4 automation executors without re-owning commits.

export interface NationalStewardBridgeHooks {
  onBeforeCoPilotLiveStep?: (input: { gameState: any; settings: any; persisted: NationalStewardPersisted | null }) => NationalStewardPersisted | null;
  onAfterAutoModeEvaluation?: (input: { gameState: any; settings: any; persisted: NationalStewardPersisted | null }) => NationalStewardPersisted | null;
  onPlayerInterruptTakeover?: (input: { persisted: NationalStewardPersisted | null; turn: number }) => NationalStewardPersisted;
}

export function createDefaultNationalStewardBridgeHooks(): NationalStewardBridgeHooks {
  return {
    onBeforeCoPilotLiveStep: ({ gameState, settings, persisted }) => {
      const base = sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted();
      const ticked = tickIdleNationalStewardTelemetry(base, {
        msSinceLastHumanInput: base.idleTelemetry.msSinceLastHumanInput,
        msSinceLastCommittedAction: base.idleTelemetry.msSinceLastCommittedAction,
        humanCommittedThisTurn: false,
        turn: gameState?.turnCounter || 1
      });
      const { persisted: planned } = planNationalStewardTurnStep(gameState, settings, ticked);
      return planned;
    },
    onAfterAutoModeEvaluation: ({ gameState, settings, persisted }) => {
      const base = sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted();
      if (!settings?.autoModeEnabled) return base;
      const path = resolveV1014AutomationPath({
        autoModeEnabled: true,
        autoModePermission: settings?.autoModeSettings?.permissionMode,
        stewardEnabled: base.enabled,
        playerControlMode: settings?.playerControlMode
      });
      return { ...base, automationPath: path, operatingMode: mapAutomationPathToStewardMode(path) };
    },
    onPlayerInterruptTakeover: ({ persisted, turn }) =>
      applyPlayerNationalStewardOverride(
        sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted(),
        { action: 'latch_manual', reason: 'Co-Pilot takeover interrupted — manual control.' },
        turn
      )
  };
}

/** Agent 25: call when persisting ExtendedGameState / save payloads. */
export function mergeAutonomousIdleNationalIntoGameState(gameState: any, persisted: NationalStewardPersisted | null | undefined): any {
  const sanitized = sanitizeAutonomousIdleNationalPersisted(persisted);
  if (!sanitized) return gameState;
  return { ...gameState, autonomousIdleNational: sanitized };
}

/** Agent 25: register in self-test lab next to runV94GameFeelPolishSelfTests. */
export function runAgent20IntegrationSelfTests(): V1014SelfTestResult[] {
  const suite = runV1014AutonomousIdleNationalSelfTests();
  const hooks = createDefaultNationalStewardBridgeHooks();
  const gs = { turnCounter: 2, takeoverSession: { status: 'active' } };
  const st = { autoModeEnabled: true, autoModeSettings: { permissionMode: 'recommend_only' }, playerControlMode: 'assistant' };
  const after = hooks.onAfterAutoModeEvaluation?.({ gameState: gs, settings: st, persisted: createDefaultAutonomousIdleNationalPersisted() });
  const interrupted = hooks.onPlayerInterruptTakeover?.({ persisted: createDefaultAutonomousIdleNationalPersisted(), turn: 2 });
  return [
    ...suite.results,
    { id: 'bridge_auto', name: 'bridge updates path after automode', passed: after?.automationPath === 'v94_auto_mode_recommend' },
    { id: 'bridge_interrupt', name: 'interrupt latches manual override', passed: interrupted?.playerOverride.latched === true }
  ];
}

export const V1014_AGENT25_INTEGRATION_CHECKLIST = [
  'Append section-20ag-v1014-autonomous-idle-national.tsx before main App export block in canonical TSX.',
  'Append section-20ag-v1014-bridges.tsx immediately after core 20AG exports.',
  'Extend sanitizeGameStateForPersistence / LOAD_STATE to read autonomousIdleNational via sanitizeAutonomousIdleNationalPersisted.',
  'Mount AutonomousIdleNationalStewardPanel in national command / settings intelligence surface (human turn only).',
  'In Co-Pilot live step loop: merge onBeforeCoPilotLiveStep persisted snapshot; respect step.blocked before executeCoPilotActionIntent.',
  'On interruptCoPilotTakeover handler: apply onPlayerInterruptTakeover to autonomousIdleNational state.',
  'Register runAgent20IntegrationSelfTests in dev lab quick tier (id: v1014_agent20).',
  'Ensure V9.4 presentation moments from computeAutonomousIdleNationalView stay UI-only (no persistence).'
] as const;
