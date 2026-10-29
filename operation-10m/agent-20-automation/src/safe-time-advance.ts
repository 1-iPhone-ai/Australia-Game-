import type { SafeTimeAdvanceContext, SafeTimeAdvanceVerdict, TimeAdvanceKind } from './types.js';

function baseBlock(reason: string, kind: TimeAdvanceKind): SafeTimeAdvanceVerdict {
  return { allowed: false, reason, blockedBy: kind };
}

function allow(reason = ''): SafeTimeAdvanceVerdict {
  return { allowed: true, reason, blockedBy: 'none' };
}

/**
 * Fail-closed gate before end_turn / advance_day while automation, approvals, or Co-Pilot work is in flight.
 * Intended for advanceDay, handleEndTurn, and idle steward national ticks.
 */
export function evaluateSafeTimeAdvance(
  ctx: SafeTimeAdvanceContext,
  kind: TimeAdvanceKind
): SafeTimeAdvanceVerdict {
  if (ctx.matchEnded) {
    return baseBlock('Match already ended.', kind);
  }
  if (ctx.gameMode !== 'game') {
    return baseBlock('Time advance only allowed during an active match.', kind);
  }
  if (ctx.dialogBlockingTime) {
    return baseBlock('Close blocking dialogs before advancing time.', kind);
  }
  if (ctx.humanAutomationExecuting) {
    return baseBlock('Human automation action still executing.', kind);
  }
  if (ctx.copilotStepInFlight) {
    return baseBlock('Co-Pilot live step still in flight.', kind);
  }
  if (ctx.pendingHumanAutomationApprovals > 0) {
    return baseBlock('Resolve pending human automation approvals first.', kind);
  }
  if (kind === 'advance_day' || kind === 'end_season') {
    if (ctx.pendingGenericApprovals > 0) {
      return baseBlock('Resolve pending approval queue before advancing the day.', kind);
    }
    if (ctx.copilotTakeoverActive && ctx.currentActorId === 'player') {
      return baseBlock('End or interrupt Co-Pilot takeover before advancing the day.', kind);
    }
    if (ctx.playerInTransit) {
      return baseBlock('Cannot advance day while player is in transit.', kind);
    }
    if (ctx.nationalStewardPaused && ctx.nationalStewardPlanBlocked) {
      return baseBlock('National steward paused with blocked plan — review before day advance.', kind);
    }
    if (ctx.autoModeReplayRecording) {
      return baseBlock('Auto Mode replay recording active — finish or cancel before day advance.', kind);
    }
  }
  if (kind === 'end_turn') {
    if (ctx.currentActorId === 'player' && ctx.playerInTransit) {
      return baseBlock('Cannot end turn while in transit.', kind);
    }
    if (
      ctx.humanAutomationEnabled &&
      ctx.pendingHumanAutomationApprovals > 0
    ) {
      return baseBlock('Pending automation confirmation blocks end turn.', kind);
    }
  }
  if (kind === 'wait_tick') {
    if (ctx.nationalStewardPlanBlocked && !ctx.nationalStewardPaused) {
      return baseBlock('Steward safeguard block — wait tick suppressed.', kind);
    }
  }
  return allow();
}

export function canAdvanceDay(ctx: SafeTimeAdvanceContext): SafeTimeAdvanceVerdict {
  return evaluateSafeTimeAdvance(ctx, 'advance_day');
}

export function canEndTurn(ctx: SafeTimeAdvanceContext): SafeTimeAdvanceVerdict {
  return evaluateSafeTimeAdvance(ctx, 'end_turn');
}

export function summarizeBlockedTimeAdvances(
  ctx: SafeTimeAdvanceContext
): { endTurn: SafeTimeAdvanceVerdict; advanceDay: SafeTimeAdvanceVerdict } {
  return {
    endTurn: canEndTurn(ctx),
    advanceDay: canAdvanceDay(ctx),
  };
}
