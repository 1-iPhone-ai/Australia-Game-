/** Agent 16 advisory mandate — recommendations never execute. */

export const ADVISORY_OPS_POLICY = {
  mandate: 'recommendations_only',
  mayExecuteActions: false,
  mayMutateGameState: false,
  mayWidenPermissions: false,
  mayBypassGuardian: false,
  mayAutoEndTurn: false,
} as const;

export const COPILOT_MAX_BLOCKED_CONTINUES = 2;
