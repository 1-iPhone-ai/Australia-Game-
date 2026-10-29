import { reservationKeyForRegionAction } from './duplicate-action-guard.ts';
import { detectIllegalSharedExclusiveTasks } from './role-assignment-engine.ts';
import {
  AGENT18_LIMITS,
  CoordinationAuditFinding,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
  TeamMultiAgentCoordinationMeta,
} from './types.ts';

function summarizeAudit(findings: CoordinationAuditFinding[]): TeamMultiAgentCoordinationMeta['auditSummary'] {
  return {
    errors: findings.filter(f => f.severity === 'error').length,
    warnings: findings.filter(f => f.severity === 'warning').length,
    info: findings.filter(f => f.severity === 'info').length,
  };
}

export function emptyCoordinationMeta(): TeamMultiAgentCoordinationMeta {
  return {
    directiveConstraints: {},
    suppressedDirectiveIds: [],
    auditSummary: { errors: 0, warnings: 0, info: 0 },
    lastReconcileStable: true,
    thrashingRegions: [],
    mutexHistory: [],
  };
}

export function auditTeamMultiAgentLayer(
  state: TeamMultiAgentLayerState,
  inputs: TeamMultiAgentInputs,
): CoordinationAuditFinding[] {
  const findings: CoordinationAuditFinding[] = [];
  const push = (f: Omit<CoordinationAuditFinding, 'id'>) => {
    if (findings.length >= AGENT18_LIMITS.maxAuditFindings) return;
    findings.push({ ...f, id: `audit_${findings.length}_${f.severity}` });
  };

  detectIllegalSharedExclusiveTasks(inputs.tasks).forEach(msg =>
    push({ severity: 'error', message: msg, actorIds: [], regionId: null }),
  );

  Object.entries(state.coordination.mutexRegions).forEach(([regionId, holderId]) => {
    const role = state.roles.find(r => r.actorId === holderId);
    const task = inputs.tasks.find(
      t => t.regionId === regionId && t.assignedActorIds.includes(holderId),
    );
    if (!task) {
      push({
        severity: 'warning',
        message: `Mutex holder ${holderId} has no assigned task for ${regionId}`,
        actorIds: [holderId],
        regionId,
      });
    }
    if (role && role.primaryRole === 'support') {
      push({
        severity: 'warning',
        message: `Support role holds mutex for ${regionId} — verify handoff`,
        actorIds: [holderId],
        regionId,
      });
    }
    const resKey = reservationKeyForRegionAction(regionId, 'region_deposit');
    const reservation = state.duplicateGuard.reservations[resKey];
    if (reservation && reservation.holderActorId !== holderId) {
      push({
        severity: 'error',
        message: `Reservation holder ${reservation.holderActorId} disagrees with mutex ${holderId}`,
        actorIds: [holderId, reservation.holderActorId],
        regionId,
      });
    }
  });

  state.coordination.arbitrationLog.forEach(entry => {
    if (entry.regionId && state.coordination.mutexRegions[entry.regionId] !== entry.winnerActorId) {
      push({
        severity: 'error',
        message: `Arbitration winner ${entry.winnerActorId} does not match mutex for ${entry.regionId}`,
        actorIds: [entry.winnerActorId],
        regionId: entry.regionId,
      });
    }
  });

  state.coordination.handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      const task = inputs.tasks.find(t => t.id === h.taskId);
      if (!task || task.status !== 'blocked') {
        push({
          severity: 'info',
          message: `Handoff ${h.id} pending without blocked task ${h.taskId}`,
          actorIds: [h.fromActorId, h.toActorId],
          regionId: h.regionId,
        });
      }
    });

  state.coordination.workstreams.forEach(ws => {
    ws.actorIds.forEach(id => {
      const role = state.roles.find(r => r.actorId === id);
      if (!role || role.taskIds.length === 0) {
        push({
          severity: 'warning',
          message: `Workstream ${ws.id} includes idle actor ${id}`,
          actorIds: [id],
          regionId: null,
        });
      }
    });
  });

  if (state.coordination.warnings.length > 3) {
    push({
      severity: 'warning',
      message: `${state.coordination.warnings.length} coordination warnings active`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.thrashingRegions.length > 0) {
    push({
      severity: 'error',
      message: `Mutex thrashing on ${state.meta.thrashingRegions.join(', ')}`,
      actorIds: [],
      regionId: state.meta.thrashingRegions[0] || null,
    });
  }

  if (state.meta.lastReconcileStable === false) {
    push({
      severity: 'warning',
      message: 'Coordination plan changed materially since last evaluation',
      actorIds: [],
      regionId: null,
    });
  }

  const suppressRate =
    state.meta.suppressedDirectiveIds.length /
    Math.max(1, state.meta.suppressedDirectiveIds.length + Object.keys(state.meta.directiveConstraints).length);
  if (state.meta.suppressedDirectiveIds.length >= 3 && suppressRate > 0.5) {
    push({
      severity: 'info',
      message: `High directive suppression rate (${state.meta.suppressedDirectiveIds.length} suppressed)`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.overdueHandoffIds && state.meta.overdueHandoffIds.length > 0) {
    push({
      severity: 'warning',
      message: `Handoff SLA overdue: ${state.meta.overdueHandoffIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.overloadedActorIds && state.meta.overloadedActorIds.length > 0) {
    push({
      severity: 'info',
      message: `Capacity overload: ${state.meta.overloadedActorIds.join(', ')}`,
      actorIds: state.meta.overloadedActorIds,
      regionId: null,
    });
  }

  state.coordination.leases.forEach(lease => {
    if (lease.expiresTurn !== null && lease.expiresTurn < state.turn) {
      push({
        severity: 'warning',
        message: `Lease ${lease.id} expired at turn ${lease.expiresTurn}`,
        actorIds: [lease.holderActorId],
        regionId: lease.regionId,
      });
    }
  });

  return findings;
}

export function attachAuditToState(
  state: TeamMultiAgentLayerState,
  findings: CoordinationAuditFinding[],
  metaPatch: Partial<TeamMultiAgentCoordinationMeta>,
): TeamMultiAgentLayerState {
  const auditFindings = findings.slice(0, AGENT18_LIMITS.maxAuditFindings);
  const meta: TeamMultiAgentCoordinationMeta = {
    ...emptyCoordinationMeta(),
    ...state.meta,
    ...metaPatch,
    auditSummary: summarizeAudit(auditFindings),
  };
  return { ...state, auditFindings, meta };
}
