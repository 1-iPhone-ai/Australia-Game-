import type {
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17PlanLedgerEntry,
  Agent17PlanLedgerSummary,
} from '../types/command-center-types.ts';

const LEDGER_CAP = 24;

export function summarizeAgent17PlanLedger(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice
): Agent17PlanLedgerSummary {
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || turn;
  const entries: Agent17PlanLedgerEntry[] = [];

  for (const log of ops.verificationLog.slice(-LEDGER_CAP)) {
    entries.push({
      id: log.id,
      turn: log.turn,
      day: log.day,
      kind: 'verify',
      summary: log.verified
        ? `Verified step ${log.stepId}: ${log.reason}`
        : `Unverified step ${log.stepId}`,
    });
  }

  const plan = ops.activePlan;
  if (plan && plan.replanCount > 0) {
    entries.push({
      id: `ledger_replan_${plan.id}`,
      turn,
      day,
      kind: 'replan',
      summary: `Replan count ${plan.replanCount} on ${plan.title}`,
    });
  }

  for (const proj of ops.delegatedProjects.slice(-8)) {
    entries.push({
      id: `ledger_delegate_${proj.id}`,
      turn: proj.assignedTurn,
      day: proj.assignedDay,
      kind: 'delegate',
      summary: `${proj.delegateKind}:${proj.delegateTargetId} · ${proj.status}`,
    });
  }

  if (plan) {
    for (const step of plan.steps.filter(s => s.status === 'blocked' || s.status === 'failed')) {
      entries.push({
        id: `ledger_block_${step.id}`,
        turn,
        day,
        kind: 'block',
        summary: `${step.title} — ${step.blockerReason || step.status}`,
      });
    }
  }

  entries.sort((a, b) => b.turn - a.turn || b.day - a.day);
  const trimmed = entries.slice(0, LEDGER_CAP);
  return {
    entries: trimmed,
    verifiedEvents: trimmed.filter(e => e.kind === 'verify').length,
    replanEvents: plan?.replanCount ?? 0,
    blockedStepEvents: trimmed.filter(e => e.kind === 'block').length,
    lastFingerprint: ops.lastContextFingerprint || '',
  };
}

export function planLedgerIndicatesInstability(ledger: Agent17PlanLedgerSummary): boolean {
  return ledger.blockedStepEvents >= 2 || ledger.replanEvents >= 2;
}
