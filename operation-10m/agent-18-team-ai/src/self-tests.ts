import { orchestrateTeamCoordination, coordinationHealthScore, acceptHandoff } from './coordination-orchestrator.ts';
import {
  arbitrateRegionLead,
  buildMutexMapWithPriorityArbitration,
  compareArbitrationCandidates,
  missionTierForTask,
} from './priority-arbitration.ts';
import {
  buildActorDirectiveConstraints,
  coordinateTeammateDirectives,
  dedupeDirectiveProposals,
  stressDirectiveCoordination,
} from './directive-coordination.ts';
import { auditTeamMultiAgentLayer } from './coordination-audit.ts';
import {
  detectMutexThrashing,
  mergeReconcileThrashing,
  reconcileCoordinationPlans,
} from './coordination-reconcile.ts';
import { evaluateDualTeamMultiAgentLayers } from './dual-team-coordination.ts';
import {
  bumpPersistTracker,
  decideTeamMultiAgentPersistence,
  teamMultiAgentPersistSignature,
} from './layer-persistence.ts';
import {
  auditCrossTeamMutexIsolation,
  filterCrossTeamDirectives,
  teamActorScope,
} from './team-boundary-guard.ts';
import {
  buildActorCapacityLedger,
  suggestCapacityRebalanceNotes,
} from './actor-capacity-ledger.ts';
import { applyDirectiveQuotaGuard } from './directive-quota-guard.ts';
import { evaluateHandoffSla } from './handoff-sla-monitor.ts';
import {
  filterHandoffsByReadiness,
  scoreHandoffReadiness,
} from './handoff-readiness-scorer.ts';
import { computeMutexStabilityIndex } from './mutex-stability-index.ts';
import {
  evaluateWorkstreamBarriers,
  trackWorkstreamBarrierSince,
} from './workstream-barrier-monitor.ts';
import { computeRoleChurnIndex } from './role-churn-index.ts';
import { evaluateLeaseExpiry } from './lease-expiry-watchdog.ts';
import { computeCoordinationComposite } from './coordination-composite-score.ts';
import { computeDirectiveCollisionIndex } from './directive-collision-index.ts';
import { evaluateHandoffChainIntegrity } from './handoff-chain-integrity.ts';
import { computeCoordinationEscalationTier } from './coordination-escalation-tier.ts';
import { buildCoordinationRecoveryPlaybook } from './coordination-recovery-playbook.ts';
import { computeDirectivePriorityInversion } from './directive-priority-inversion.ts';
import { detectHandoffOrphans } from './handoff-orphan-detector.ts';
import { detectWorkstreamDeadlocks } from './workstream-deadlock-detector.ts';
import { computeLeaseContentionIndex } from './lease-contention-index.ts';
import { measureCoordinationSaturation } from './coordination-saturation-gauge.ts';
import { computeMutexLeaseDivergenceIndex } from './mutex-lease-divergence-index.ts';
import { analyzeHandoffCascadeRisk } from './handoff-cascade-analyzer.ts';
import { computeSuppressionBacklogIndex } from './suppression-backlog-index.ts';
import {
  DuplicateActionGuard,
  buildActionFingerprint,
  detectDuplicateIntents,
  tryCommitAction,
} from './duplicate-action-guard.ts';
import { evaluateTeamMultiAgentLayer, teamMultiAgentSignature } from './multi-agent-state.ts';
import {
  assignTeamRolesWithSlots,
  detectIllegalSharedExclusiveTasks,
  resolveExclusiveSlotCollisions,
  summarizeRoleBoard,
} from './role-assignment-engine.ts';
import {
  AGENT18_LIMITS,
  RoleAssignment,
  TeamMultiAgentInputs,
  TeamTaskSnapshot,
  TeammateDirectiveProposal,
} from './types.ts';

export interface Agent18SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function check(
  results: Agent18SelfTestResult[],
  id: string,
  name: string,
  fn: () => boolean | string,
): void {
  try {
    const out = fn();
    results.push({
      id,
      name,
      passed: out === true,
      detail: out === true ? 'ok' : String(out || 'failed'),
    });
  } catch (e) {
    results.push({
      id,
      name,
      passed: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }
}

function baseInputs(overrides: Partial<TeamMultiAgentInputs> = {}): TeamMultiAgentInputs {
  const tasks: TeamTaskSnapshot[] = [
    {
      id: 'task_defend_NSW',
      type: 'defend_region',
      label: 'Defend NSW',
      status: 'ready',
      priority: 1,
      assignedActorIds: ['player'],
      regionId: 'NSW',
      resourceRequirement: 2000,
      dependencies: [],
      humanStatus: 'suggested',
    },
    {
      id: 'task_cash_mate',
      type: 'generate_cash',
      label: 'Generate team cash',
      status: 'ready',
      priority: 2,
      assignedActorIds: ['mate'],
      regionId: null,
      resourceRequirement: 0,
      dependencies: [],
    },
  ];
  return {
    teamId: 'team_player',
    turn: 7,
    actors: [
      {
        id: 'player',
        name: 'You',
        isHuman: true,
        inRecovery: false,
        location: 'NSW',
        apRemaining: 3,
        brainRole: null,
      },
      {
        id: 'mate',
        name: 'Riley',
        isHuman: false,
        inRecovery: false,
        location: 'VIC',
        apRemaining: null,
        brainRole: 'earner',
      },
    ],
    tasks,
    command: {
      responsibilities: [
        { actorId: 'mate', focus: 'economy' },
        { actorId: 'player', focus: 'controller', regionId: 'NSW' },
      ],
      lockedActorIds: [],
      reserveFloor: 8000,
    },
    previousRoles: [],
    roleSince: {},
    lockedRoles: [],
    roleMinTurns: AGENT18_LIMITS.roleMinTurnsDefault,
    ...overrides,
  };
}

export function runAgent18TeamMultiAgentSelfTests(): Agent18SelfTestResult[] {
  const results: Agent18SelfTestResult[] = [];

  check(results, 'a18_roles_explicit', 'Roles: explicit command assigns Riley earner and player controller', () => {
    const { roles } = assignTeamRolesWithSlots(baseInputs());
    const mate = roles.find(r => r.actorId === 'mate');
    const me = roles.find(r => r.actorId === 'player');
    return (mate?.primaryRole === 'earner' && mate.explicit && me?.primaryRole === 'controller') || summarizeRoleBoard(roles);
  });

  check(results, 'a18_roles_hysteresis', 'Roles: non-explicit roles hold for roleMinTurns', () => {
    const first = assignTeamRolesWithSlots(baseInputs({ turn: 7 }));
    const prev = first.roles;
    const moved = baseInputs({ turn: 8 });
    moved.tasks = moved.tasks.map(t =>
      t.id === 'task_cash_mate' ? { ...t, type: 'take_region', label: 'Take QLD', regionId: 'QLD' } : t,
    );
    const second = assignTeamRolesWithSlots({ ...moved, previousRoles: prev, roleSince: { mate: 7 } });
    const before = prev.find(r => r.actorId === 'mate')!.primaryRole;
    const after = second.roles.find(r => r.actorId === 'mate')!.primaryRole;
    return before === after || `${before}→${after}`;
  });

  check(results, 'a18_roles_recovery', 'Roles: AI in recovery forced to recovery role', () => {
    const inp = baseInputs({ command: null });
    inp.actors = inp.actors.map(a => (a.id === 'mate' ? { ...a, inRecovery: true } : a));
    const { roles } = assignTeamRolesWithSlots(inp);
    return roles.find(r => r.actorId === 'mate')?.primaryRole === 'recovery' || 'not recovery';
  });

  check(results, 'a18_slot_collision', 'Roles: exclusive slot collision demotes loser to support', () => {
    const roles: RoleAssignment[] = [
      {
        actorId: 'a',
        primaryRole: 'controller',
        secondaryRole: null,
        responsibility: 'Defend NSW',
        reason: 'test',
        taskIds: ['t1'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: false,
        confidence: 0.8,
        explicit: false,
        exclusiveSlotId: 'region:NSW:defend_region',
      },
      {
        actorId: 'b',
        primaryRole: 'explorer',
        secondaryRole: null,
        responsibility: 'Also NSW',
        reason: 'test',
        taskIds: ['t2'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: false,
        confidence: 0.8,
        explicit: false,
        exclusiveSlotId: 'region:NSW:defend_region',
      },
    ];
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 't1',
        type: 'defend_region',
        label: 'Defend NSW',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['a'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
      {
        id: 't2',
        type: 'defend_region',
        label: 'Defend NSW too',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['b'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
    ];
    const out = resolveExclusiveSlotCollisions(roles, tasks);
    const loser = out.roles.find(r => r.actorId === 'b');
    return (loser?.primaryRole === 'support' && out.notes.length > 0) || JSON.stringify(out);
  });

  check(results, 'a18_coord_mutex', 'Coordination: region mutex selects single lead for deposits', () => {
    const inp = baseInputs();
    const ev = evaluateTeamMultiAgentLayer(inp, null);
    return ev.state.coordination.mutexRegions.NSW === 'player' || JSON.stringify(ev.state.coordination.mutexRegions);
  });

  check(results, 'a18_coord_parallel', 'Coordination: human and AI can work in parallel workstream', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const ws = ev.state.coordination.workstreams[0];
    return (ws && ws.actorIds.includes('player') && ws.actorIds.includes('mate')) || 'no workstream';
  });

  check(results, 'a18_coord_handoff', 'Coordination: accepting handoff moves mutex holder', () => {
    let plan = orchestrateTeamCoordination(5, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    plan = {
      ...plan,
      handoffs: [
        {
          id: 'h1',
          fromActorId: 'player',
          toActorId: 'mate',
          regionId: 'NSW',
          taskId: 'task_defend_NSW',
          status: 'pending',
          requestedTurn: 5,
          reason: 'test',
        },
      ],
    };
    const next = acceptHandoff(plan, 'h1');
    return next.mutexRegions.NSW === 'mate' || JSON.stringify(next.mutexRegions);
  });

  check(results, 'a18_coord_health', 'Coordination: health score penalizes warnings', () => {
    const good = coordinationHealthScore({ leases: [], handoffs: [], workstreams: [], mutexRegions: {}, warnings: [], arbitrationLog: [] });
    const bad = coordinationHealthScore({
      leases: [],
      handoffs: [],
      workstreams: [],
      mutexRegions: {},
      warnings: ['a', 'b', 'c', 'd', 'e'],
      arbitrationLog: [],
    });
    return good > bad || `${good} vs ${bad}`;
  });

  check(results, 'a18_dup_commit_once', 'Duplicate guard: same fingerprint blocked as duplicate_action_token', () => {
    const guard = new DuplicateActionGuard(undefined, 3);
    const fp = buildActionFingerprint({
      actorId: 'mate',
      actionKind: 'region_deposit',
      targetId: 'NSW',
      turn: 3,
      executionGeneration: 1,
      amount: 500,
    });
    const first = guard.tryCommit(fp);
    const second = guard.tryCommit(fp);
    return first.ok === true && second.ok === false && second.reason === 'duplicate_action_token';
  });

  check(results, 'a18_dup_stale_gen', 'Duplicate guard: stale execution generation rejected', () => {
    const state = { version: 1 as const, committedKeys: [], generationByActor: { mate: 5 }, turn: 4, reservations: {} };
    const fp = buildActionFingerprint({
      actorId: 'mate',
      actionKind: 'travel',
      targetId: 'VIC',
      turn: 4,
      executionGeneration: 3,
    });
    const out = tryCommitAction(state, fp);
    return out.result.ok === false && out.result.reason === 'stale_generation';
  });

  check(results, 'a18_dup_mutex_block', 'Duplicate guard: non-holder blocked by coordination mutex', () => {
    const fp = buildActionFingerprint({
      actorId: 'mate',
      actionKind: 'region_deposit',
      targetId: 'NSW',
      turn: 2,
      executionGeneration: 1,
    });
    const coordination = orchestrateTeamCoordination(2, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    const out = tryCommitAction(emptyGuard(2), fp, coordination);
    return out.result.ok === false && out.result.reason === 'lease_blocked';
  });

  check(results, 'a18_dup_intent_scan', 'Duplicate guard: detectDuplicateIntents finds parallel proposals', () => {
    const a = buildActionFingerprint({ actorId: 'm', actionKind: 'travel', targetId: 'X', turn: 1, executionGeneration: 1 });
    const b = buildActionFingerprint({ actorId: 'm', actionKind: 'travel', targetId: 'X', turn: 1, executionGeneration: 2 });
    return detectDuplicateIntents([a, b]).length === 1 || 'missed dupe';
  });

  check(results, 'a18_shared_exclusive', 'Safeguard: illegal shared exclusive tasks flagged', () => {
    const tasks = baseInputs().tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, assignedActorIds: ['player', 'mate'] } : t,
    );
    const issues = detectIllegalSharedExclusiveTasks(tasks);
    return issues.length > 0 || 'no issue detected';
  });

  check(results, 'a18_eval_deterministic', 'Layer evaluation is deterministic for identical inputs', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const b = evaluateTeamMultiAgentLayer(baseInputs(), null);
    return teamMultiAgentSignature(a.state) === teamMultiAgentSignature(b.state) || 'signatures differ';
  });

  check(results, 'a18_reservation_wiring', 'Layer evaluation reserves region deposit slots for mutex holder', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const key = 'res:NSW:region_deposit';
    const r = ev.state.duplicateGuard.reservations[key];
    return (r && r.holderActorId === 'player') || JSON.stringify(ev.state.duplicateGuard.reservations);
  });

  check(results, 'a18_turn_advance', 'Duplicate guard trims reservations on turn advance', () => {
    const prev = evaluateTeamMultiAgentLayer(baseInputs({ turn: 5 }), null);
    const next = evaluateTeamMultiAgentLayer(baseInputs({ turn: 8 }), prev.state);
    return next.state.duplicateGuard.turn === 8 || `turn ${next.state.duplicateGuard.turn}`;
  });

  check(results, 'a18_arb_defend_beats_take', 'Priority: defend_region beats take_region on same region even with worse task priority', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'def',
        type: 'defend_region',
        label: 'Defend NSW',
        status: 'ready',
        priority: 3,
        assignedActorIds: ['player'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
      {
        id: 'take',
        type: 'take_region',
        label: 'Take NSW',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['mate'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(baseInputs({ tasks, command: null })).roles;
    const { mutexRegions } = buildMutexMapWithPriorityArbitration(tasks, roles);
    return mutexRegions.NSW === 'player' || JSON.stringify(mutexRegions);
  });

  check(results, 'a18_arb_tiebreak_actor', 'Priority: identical tier/priority tie-breaks by actorId lexicographic order', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'd1',
        type: 'defend_region',
        label: 'Defend QLD',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['zeta'],
        regionId: 'QLD',
        resourceRequirement: 500,
        dependencies: [],
      },
      {
        id: 'd2',
        type: 'defend_region',
        label: 'Defend QLD too',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['alpha'],
        regionId: 'QLD',
        resourceRequirement: 500,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(
      baseInputs({
        tasks,
        command: null,
        actors: [
          { id: 'alpha', name: 'A', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
          { id: 'zeta', name: 'Z', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
        ],
      }),
    ).roles;
    const { holderActorId } = arbitrateRegionLead('QLD', tasks, roles);
    return holderActorId === 'alpha' || `holder ${holderActorId}`;
  });

  check(results, 'a18_arb_explicit_boost', 'Priority: explicit assignment wins among equal mission tiers', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 't1',
        type: 'take_region',
        label: 'Take SA',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['player'],
        regionId: 'SA',
        resourceRequirement: 800,
        dependencies: [],
      },
      {
        id: 't2',
        type: 'take_region',
        label: 'Take SA too',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['mate'],
        regionId: 'SA',
        resourceRequirement: 800,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(
      baseInputs({
        tasks,
        command: {
          responsibilities: [{ actorId: 'mate', focus: 'expansion', regionId: 'SA' }],
          lockedActorIds: [],
          reserveFloor: null,
        },
      }),
    ).roles;
    const { mutexRegions } = buildMutexMapWithPriorityArbitration(tasks, roles);
    return mutexRegions.SA === 'mate' || JSON.stringify({ mutexRegions, roles });
  });

  check(results, 'a18_arb_locked_retains', 'Priority: locked actor keeps lead when scores are close', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'd1',
        type: 'defend_region',
        label: 'Defend WA',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['locked'],
        regionId: 'WA',
        resourceRequirement: 500,
        dependencies: [],
      },
      {
        id: 'd2',
        type: 'defend_region',
        label: 'Defend WA',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['other'],
        regionId: 'WA',
        resourceRequirement: 500,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(
      baseInputs({
        tasks,
        command: null,
        lockedRoles: ['locked'],
        actors: [
          { id: 'locked', name: 'L', isHuman: false, inRecovery: false, location: 'WA', apRemaining: null, brainRole: null },
          { id: 'other', name: 'O', isHuman: false, inRecovery: false, location: 'WA', apRemaining: null, brainRole: null },
        ],
      }),
    ).roles;
    const { mutexRegions } = buildMutexMapWithPriorityArbitration(tasks, roles, ['locked']);
    return mutexRegions.WA === 'locked' || JSON.stringify(mutexRegions);
  });

  check(results, 'a18_arb_recovery_loses', 'Priority: recovery-weighted actor loses region lead to healthy defender', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'rec',
        type: 'defend_region',
        label: 'Defend NT',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['sick'],
        regionId: 'NT',
        resourceRequirement: 500,
        dependencies: [],
      },
      {
        id: 'ok',
        type: 'defend_region',
        label: 'Defend NT',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['healthy'],
        regionId: 'NT',
        resourceRequirement: 500,
        dependencies: [],
      },
    ];
    const roles: RoleAssignment[] = [
      {
        actorId: 'sick',
        primaryRole: 'recovery',
        secondaryRole: null,
        responsibility: 'Recover',
        reason: 'test',
        taskIds: ['rec'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: true,
        confidence: 0.5,
        explicit: false,
        exclusiveSlotId: null,
      },
      {
        actorId: 'healthy',
        primaryRole: 'controller',
        secondaryRole: null,
        responsibility: 'Defend NT',
        reason: 'test',
        taskIds: ['ok'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: false,
        confidence: 0.8,
        explicit: false,
        exclusiveSlotId: null,
      },
    ];
    const { holderActorId } = arbitrateRegionLead('NT', tasks, roles);
    return holderActorId === 'healthy' || `holder ${holderActorId}`;
  });

  check(results, 'a18_arb_log_wired', 'Priority: arbitration log attached to coordination plan', () => {
    const tasks = baseInputs().tasks.concat({
      id: 'task_take_VIC',
      type: 'take_region',
      label: 'Take VIC',
      status: 'ready',
      priority: 1,
      assignedActorIds: ['mate'],
      regionId: 'VIC',
      resourceRequirement: 500,
      dependencies: [],
    });
    const ev = evaluateTeamMultiAgentLayer(baseInputs({ tasks }), null);
    return (
      ev.state.coordination.arbitrationLog.length >= 2 &&
      ev.state.diagnostics.some(d => d.includes('Priority arbitration'))
    ) || JSON.stringify({ log: ev.state.coordination.arbitrationLog, diag: ev.state.diagnostics.slice(0, 5) });
  });

  check(results, 'a18_arb_compare_stable', 'Priority: compareArbitrationCandidates is antisymmetric and deterministic', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'x',
        type: 'take_region',
        label: 'X',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['a'],
        regionId: 'TAS',
        resourceRequirement: 1,
        dependencies: [],
      },
    ];
    const ca = {
      actorId: 'a',
      task: tasks[0],
      role: null,
      explicit: false,
      locked: false,
    };
    const cb = { ...ca, actorId: 'b' };
    const ab = compareArbitrationCandidates(ca, cb, 'TAS');
    const ba = compareArbitrationCandidates(cb, ca, 'TAS');
    return ab < 0 && ba > 0 && missionTierForTask(tasks[0]) === 8;
  });

  check(results, 'a18_dir_mutex_suppress', 'Directives: non-holder region deposit proposal suppressed', () => {
    const inp = baseInputs();
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'd1', actorId: 'mate', goalKind: 'region_deposit', targetRegionId: 'NSW', taskId: 'x', priority: 1 },
    ];
    const ev = evaluateTeamMultiAgentLayer({ ...inp, directiveProposals: proposals }, null);
    return (
      ev.state.meta.suppressedDirectiveIds.includes('d1') &&
      ev.state.coordination.mutexRegions.NSW === 'player'
    ) || JSON.stringify(ev.state.meta);
  });

  check(results, 'a18_dir_dedupe', 'Directives: dedupeDirectiveProposals keeps highest-priority unique keys', () => {
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'a', actorId: 'm', goalKind: 'travel', targetRegionId: 'VIC', taskId: null, priority: 2 },
      { id: 'b', actorId: 'm', goalKind: 'travel', targetRegionId: 'VIC', taskId: null, priority: 1 },
    ];
    const out = dedupeDirectiveProposals(proposals);
    return out.length === 1 && out[0].id === 'b' || JSON.stringify(out);
  });

  check(results, 'a18_dir_recovery_block', 'Directives: recovery role blocks expansion directives', () => {
    const inp = baseInputs({ command: null });
    inp.actors = inp.actors.map(a => (a.id === 'mate' ? { ...a, inRecovery: true } : a));
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'exp', actorId: 'mate', goalKind: 'take_region', targetRegionId: 'QLD', taskId: null, priority: 1 },
    ];
    const ev = evaluateTeamMultiAgentLayer({ ...inp, directiveProposals: proposals }, null);
    return ev.state.meta.suppressedDirectiveIds.includes('exp') || JSON.stringify(ev.state.meta);
  });

  check(results, 'a18_dir_constraints', 'Directives: mutex holder receives lead constraint label', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const c = ev.state.meta.directiveConstraints.player;
    return (typeof c === 'string' && c.includes('NSW')) || JSON.stringify(ev.state.meta.directiveConstraints);
  });

  check(results, 'a18_audit_shared_exclusive', 'Audit: illegal shared exclusive tasks surface as errors', () => {
    const tasks = baseInputs().tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, assignedActorIds: ['player', 'mate'] } : t,
    );
    const ev = evaluateTeamMultiAgentLayer(baseInputs({ tasks }), null);
    return ev.auditFindings.some(f => f.severity === 'error') || JSON.stringify(ev.auditFindings);
  });

  check(results, 'a18_audit_reservation', 'Audit: reservation/mutex mismatch flagged', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const bad = { ...ev.state };
    bad.duplicateGuard = {
      ...bad.duplicateGuard,
      reservations: {
        'res:NSW:region_deposit': { holderActorId: 'mate', taskId: 't', turn: ev.state.turn },
      },
    };
    const findings = auditTeamMultiAgentLayer(bad, baseInputs());
    return findings.some(f => f.severity === 'error' && /disagrees with mutex/.test(f.message));
  });

  check(results, 'a18_stress_directives', 'Stress: directive coordination stable over 5 turns', () => {
    const roles = assignTeamRolesWithSlots(baseInputs()).roles;
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'p', actorId: 'mate', goalKind: 'region_deposit', targetRegionId: 'NSW', taskId: null, priority: 1 },
    ];
    const steps = stressDirectiveCoordination(
      proposals,
      () => orchestrateTeamCoordination(0, baseInputs().tasks, roles),
      roles,
      5,
    );
    return steps.length === 5 && steps.every(s => s.suppressedCount >= 1) || JSON.stringify(steps);
  });

  check(results, 'a18_meta_summary', 'Audit: meta auditSummary matches finding severities', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const s = ev.state.meta.auditSummary;
    const counts = {
      errors: ev.auditFindings.filter(f => f.severity === 'error').length,
      warnings: ev.auditFindings.filter(f => f.severity === 'warning').length,
      info: ev.auditFindings.filter(f => f.severity === 'info').length,
    };
    return s.errors === counts.errors && s.warnings === counts.warnings && s.info === counts.info;
  });

  check(results, 'a18_reconcile_stable', 'Reconcile: identical plans report stable with no changes', () => {
    const plan = orchestrateTeamCoordination(3, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    const r = reconcileCoordinationPlans(plan, plan, 4);
    return r.stable && r.changes.length === 0;
  });

  check(results, 'a18_reconcile_mutex_change', 'Reconcile: mutex holder change recorded', () => {
    const prev = orchestrateTeamCoordination(1, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    const next = { ...prev, mutexRegions: { ...prev.mutexRegions, NSW: 'mate' } };
    const r = reconcileCoordinationPlans(prev, next, 2);
    return r.changes.some(c => c.kind === 'mutex_holder_changed') || JSON.stringify(r.changes);
  });

  check(results, 'a18_thrash_detect', 'Reconcile: detectMutexThrashing flags flip-flopping region', () => {
    const history = [
      { NSW: 'player' },
      { NSW: 'mate' },
      { NSW: 'player' },
      { NSW: 'mate' },
    ];
    const thrash = detectMutexThrashing(history, 2);
    return thrash.includes('NSW') || JSON.stringify(thrash);
  });

  check(results, 'a18_eval_reconcile_meta', 'Layer: prior state yields reconcile metadata on plan change', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs({ turn: 4 }), null);
    const b = evaluateTeamMultiAgentLayer(baseInputs({ turn: 5 }), a.state);
    return b.state.meta.mutexHistory.length >= 2 || `history ${b.state.meta.mutexHistory.length}`;
  });

  check(results, 'a18_audit_expired_lease', 'Audit: expired treasury lease surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs({ turn: 10 }), null);
    const state = { ...ev.state };
    state.coordination = {
      ...state.coordination,
      leases: [
        {
          id: 'lease_x',
          kind: 'treasury_request',
          holderActorId: 'mate',
          regionId: null,
          taskId: 'task_cash_mate',
          sinceTurn: 8,
          expiresTurn: 9,
          reason: 'test',
        },
      ],
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs({ turn: 10 }));
    return findings.some(f => /expired/.test(f.message)) || JSON.stringify(findings);
  });

  check(results, 'a18_audit_thrash_error', 'Audit: thrashing regions in meta escalate to error finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, thrashingRegions: ['NSW'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'error' && /thrashing/.test(f.message));
  });

  check(results, 'a18_merge_reconcile_thrash', 'Reconcile: mergeReconcileThrashing marks plan unstable', () => {
    const history = [{ NSW: 'a' }, { NSW: 'b' }, { NSW: 'a' }, { NSW: 'b' }];
    const base = reconcileCoordinationPlans(null, orchestrateTeamCoordination(0, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles), 1);
    const merged = mergeReconcileThrashing(base, history);
    return merged.stable === false && merged.thrashingRegions.includes('NSW');
  });

  check(results, 'a18_boundary_cross_directive', 'Boundary: cross-team directive proposals rejected', () => {
    const scope = teamActorScope(baseInputs());
    const { rejected } = filterCrossTeamDirectives(
      [{ id: 'x', actorId: 'enemy_bot', goalKind: 'travel', targetRegionId: null, taskId: null, priority: 1 }],
      scope,
    );
    return rejected.length === 1 && rejected[0].reason.includes('cross_team');
  });

  check(results, 'a18_boundary_eval', 'Boundary: evaluate layer rejects out-of-team directive via diagnostics', () => {
    const ev = evaluateTeamMultiAgentLayer(
      {
        ...baseInputs(),
        directiveProposals: [
          { id: 'bad', actorId: 'rival', goalKind: 'region_deposit', targetRegionId: 'NSW', taskId: null, priority: 1 },
        ],
      },
      null,
    );
    return ev.state.diagnostics.some(d => d.includes('cross-team')) || JSON.stringify(ev.state.diagnostics);
  });

  check(results, 'a18_persist_unchanged', 'Persistence: identical evaluation skips commit', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const d = decideTeamMultiAgentPersistence(a.state, a.state, teamMultiAgentPersistSignature(a.state), 0);
    return d.commit === false && d.reason.includes('unchanged');
  });

  check(results, 'a18_persist_material', 'Persistence: first material state commits', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const d = decideTeamMultiAgentPersistence(null, a.state, null, 0);
    return d.commit === true || d.reason;
  });

  check(results, 'a18_persist_cap', 'Persistence: commit cap blocks excessive commits', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const mutated = {
      ...a.state,
      coordination: {
        ...a.state.coordination,
        mutexRegions: { ...a.state.coordination.mutexRegions, TAS: 'mate' },
      },
    };
    const d = decideTeamMultiAgentPersistence(
      a.state,
      mutated,
      null,
      AGENT18_LIMITS.maxCommitsPerTurn,
    );
    return d.commit === false && d.reason.includes('cap');
  });

  check(results, 'a18_persist_tracker', 'Persistence: bumpPersistTracker resets on new turn', () => {
    const t1 = bumpPersistTracker({ turn: 1, commits: 2, lastSignature: 'a' }, 2, 'b', true);
    return t1.turn === 2 && t1.commits === 1;
  });

  check(results, 'a18_dual_team', 'Dual team: friendly + enemy evaluate with separate byTeam states', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [
        {
          id: 'take_qld',
          type: 'take_region',
          label: 'Take QLD',
          status: 'ready',
          priority: 1,
          assignedActorIds: ['ai1'],
          regionId: 'QLD',
          resourceRequirement: 500,
          dependencies: [],
        },
      ],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      dual.enemy !== null &&
      dual.byTeam.team_player &&
      dual.byTeam.team_opponent &&
      dual.isolationIssues.length === 0 &&
      typeof dual.handoffSlaCombinedCompliance === 'number'
    ) || JSON.stringify({ issues: dual.isolationIssues });
  });

  check(results, 'a18_dual_mutex_overlap', 'Dual team: overlapping mutex regions flagged', () => {
    const issues = auditCrossTeamMutexIsolation({ NSW: 'player' }, { NSW: 'ai1' });
    return issues.length === 1 && /overlap/.test(issues[0]);
  });

  check(results, 'a18_eval_persistence_field', 'Layer evaluation exposes persistence decision', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    return typeof ev.persistence.commit === 'boolean' && Boolean(ev.persistence.signature);
  });

  check(results, 'a18_handoff_sla_overdue', 'Handoff SLA: stale pending handoff flagged overdue', () => {
    const report = evaluateHandoffSla(10, [
      {
        id: 'h_old',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 5,
        reason: 'test',
      },
    ]);
    return report.overdueHandoffIds.includes('h_old') && report.complianceScore === 0;
  });

  check(results, 'a18_handoff_sla_clean', 'Handoff SLA: fresh pending handoff stays compliant', () => {
    const report = evaluateHandoffSla(6, [
      {
        id: 'h_new',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 6,
        reason: 'test',
      },
    ]);
    return report.overdueHandoffIds.length === 0 && report.complianceScore === 100;
  });

  check(results, 'a18_capacity_overload', 'Capacity: zero AP with ready tasks marks overloaded', () => {
    const inp = baseInputs();
    inp.actors = inp.actors.map(a => (a.id === 'player' ? { ...a, apRemaining: 0 } : a));
    const roles = assignTeamRolesWithSlots(inp).roles;
    const ledger = buildActorCapacityLedger(inp.actors, inp.tasks, roles);
    return ledger.overloadedActorIds.includes('player') || JSON.stringify(ledger);
  });

  check(results, 'a18_capacity_idle', 'Capacity: high AP without tasks marks idle', () => {
    const inp = baseInputs({ command: null });
    inp.actors = [
      { id: 'solo', name: 'S', isHuman: false, inRecovery: false, location: 'NSW', apRemaining: 5, brainRole: null },
    ];
    inp.tasks = [];
    const roles = assignTeamRolesWithSlots(inp).roles;
    const ledger = buildActorCapacityLedger(inp.actors, inp.tasks, roles);
    return ledger.idleActorIds.includes('solo') && ledger.rows[0]?.status === 'idle';
  });

  check(results, 'a18_capacity_rebalance_hint', 'Capacity: rebalance hint when overload and idle coexist', () => {
    const ledger = {
      rows: [],
      balanceScore: 50,
      overloadedActorIds: ['a'],
      idleActorIds: ['b'],
      notes: [],
    };
    const hints = suggestCapacityRebalanceNotes(ledger);
    return hints.length === 1 && hints[0].includes('a') && hints[0].includes('b');
  });

  check(results, 'a18_quota_actor_cap', 'Directive quota: actor cap drops lower-priority extras', () => {
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'p1', actorId: 'mate', goalKind: 'travel', targetRegionId: 'VIC', taskId: null, priority: 1 },
      { id: 'p2', actorId: 'mate', goalKind: 'travel', targetRegionId: 'QLD', taskId: null, priority: 2 },
      { id: 'p3', actorId: 'mate', goalKind: 'travel', targetRegionId: 'SA', taskId: null, priority: 3 },
      { id: 'p4', actorId: 'mate', goalKind: 'travel', targetRegionId: 'WA', taskId: null, priority: 4 },
    ];
    const q = applyDirectiveQuotaGuard(proposals, { maxPerActorPerTurn: 2, maxPerTeamPerTurn: 8 });
    return q.allowed.length === 2 && q.dropped.some(d => d.proposal.id === 'p3');
  });

  check(results, 'a18_quota_team_cap', 'Directive quota: team cap enforced across actors', () => {
    const proposals: TeammateDirectiveProposal[] = Array.from({ length: 10 }, (_, i) => ({
      id: `d${i}`,
      actorId: i % 2 === 0 ? 'player' : 'mate',
      goalKind: 'travel',
      targetRegionId: 'VIC',
      taskId: null,
      priority: i,
    }));
    const q = applyDirectiveQuotaGuard(proposals, { maxPerActorPerTurn: 5, maxPerTeamPerTurn: 4 });
    return q.allowed.length === 4 && q.dropped.length === 6;
  });

  check(results, 'a18_eval_round4_meta', 'Layer: round-4 meta exposes SLA, capacity, quota fields', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.handoffSlaCompliance === 'number' &&
      typeof m.capacityBalanceScore === 'number' &&
      m.directiveQuotaRemaining !== undefined
    );
  });

  check(results, 'a18_dual_sla_compliance', 'Dual team: combined handoff SLA compliance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return typeof dual.handoffSlaCombinedCompliance === 'number';
  });

  check(results, 'a18_handoff_readiness_block', 'Handoff readiness: zero AP marks target not ready', () => {
    const handoffs = [
      {
        id: 'h1',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 'task_defend_NSW',
        status: 'pending' as const,
        requestedTurn: 5,
        reason: 'test',
      },
    ];
    const inp = baseInputs();
    inp.tasks = inp.tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, status: 'blocked' as const } : t,
    );
    inp.actors = inp.actors.map(a => (a.id === 'mate' ? { ...a, apRemaining: 0 } : a));
    const roles = assignTeamRolesWithSlots(inp).roles;
    const report = scoreHandoffReadiness(handoffs, inp.actors, roles, inp.tasks);
    return report.notReadyHandoffIds.includes('h1') && report.averageReadiness < 100;
  });

  check(results, 'a18_handoff_readiness_ok', 'Handoff readiness: blocked task + AP yields ready target', () => {
    const handoffs = [
      {
        id: 'h_ok',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 'task_defend_NSW',
        status: 'pending' as const,
        requestedTurn: 6,
        reason: 'test',
      },
    ];
    const inp = baseInputs();
    inp.tasks = inp.tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, status: 'blocked' as const } : t,
    );
    const roles = assignTeamRolesWithSlots(inp).roles;
    const report = scoreHandoffReadiness(handoffs, inp.actors, roles, inp.tasks);
    const row = report.rows.find(r => r.handoffId === 'h_ok');
    return row?.ready === true && report.notReadyHandoffIds.length === 0;
  });

  check(results, 'a18_handoff_filter_defer', 'Handoff filter: defers unreadiness below score threshold', () => {
    const handoffs = [
      {
        id: 'h_bad',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 't',
        status: 'pending' as const,
        requestedTurn: 1,
        reason: 'test',
      },
    ];
    const report = scoreHandoffReadiness(
      handoffs,
      [{ id: 'mate', name: 'M', isHuman: false, inRecovery: true, location: 'NSW', apRemaining: 0, brainRole: null }],
      [],
      [{ id: 't', type: 'defend_region', label: 'x', status: 'blocked', priority: 1, assignedActorIds: ['player'], regionId: 'NSW', resourceRequirement: 1, dependencies: [] }],
    );
    const filtered = filterHandoffsByReadiness(handoffs, report);
    return filtered.deferredIds.includes('h_bad') && filtered.eligible.length === 0;
  });

  check(results, 'a18_mutex_stability_stable', 'Mutex stability: steady holder history scores 100', () => {
    const history = [{ NSW: 'player' }, { NSW: 'player' }, { NSW: 'player' }];
    const report = computeMutexStabilityIndex(history, []);
    return report.stabilityIndex === 100 && report.volatileRegionIds.length === 0;
  });

  check(results, 'a18_mutex_stability_volatile', 'Mutex stability: flip-flopping region marked volatile', () => {
    const history = [{ NSW: 'a' }, { NSW: 'b' }, { NSW: 'a' }, { NSW: 'b' }];
    const report = computeMutexStabilityIndex(history, []);
    return report.volatileRegionIds.includes('NSW') && report.stabilityIndex < 100;
  });

  check(results, 'a18_mutex_stability_thrash_penalty', 'Mutex stability: thrashing list forces volatile region', () => {
    const report = computeMutexStabilityIndex([{ NSW: 'a' }, { NSW: 'b' }], ['NSW']);
    return report.volatileRegionIds.includes('NSW');
  });

  check(results, 'a18_barrier_stall', 'Workstream barrier: long wait marks stall', () => {
    const ws = [
      {
        id: 'ws1',
        actorIds: ['player', 'mate'],
        taskIds: ['b1'],
        phase: 'waiting_barrier' as const,
        barrierTaskIds: ['b1'],
      },
    ];
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'b1',
        type: 'preserve_reserve',
        label: 'Reserve',
        status: 'waiting',
        priority: 1,
        assignedActorIds: ['player', 'mate'],
        regionId: null,
        resourceRequirement: 0,
        dependencies: [],
      },
    ];
    const report = evaluateWorkstreamBarriers(10, ws, tasks, {
      workstreamSinceTurn: { ws1: 5 },
      maxBarrierWaitTurns: 2,
    });
    return report.stalledWorkstreamIds.includes('ws1') && report.barrierComplianceScore === 0;
  });

  check(results, 'a18_barrier_track_since', 'Workstream barrier: since-turn tracker resets when phase clears', () => {
    const ws = [
      {
        id: 'ws1',
        actorIds: ['a'],
        taskIds: [],
        phase: 'active' as const,
        barrierTaskIds: [],
      },
    ];
    const tracked = trackWorkstreamBarrierSince({ ws1: 3, ws_old: 1 }, ws, 7);
    return tracked.ws1 === undefined && tracked.ws_old === 1;
  });

  check(results, 'a18_eval_round5_meta', 'Layer: round-5 meta exposes readiness, stability, barrier fields', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.handoffReadinessAverage === 'number' &&
      typeof m.mutexStabilityIndex === 'number' &&
      typeof m.workstreamBarrierCompliance === 'number'
    );
  });

  check(results, 'a18_audit_handoff_not_ready', 'Audit: not-ready handoffs surface warning finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, notReadyHandoffIds: ['h_x'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /not ready/.test(f.message));
  });

  check(results, 'a18_dual_mutex_stability', 'Dual team: combined mutex stability exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return typeof dual.mutexStabilityCombined === 'number';
  });

  check(results, 'a18_role_churn_detect', 'Role churn: primary role change increments churn index', () => {
    const prev = [{ actorId: 'player', primaryRole: 'controller' as const, secondaryRole: null, responsibility: '', reason: '', taskIds: [], startTurn: 1, reviewCondition: '', temporary: false, confidence: 1, explicit: false, exclusiveSlotId: null }];
    const next = [{ ...prev[0], primaryRole: 'explorer' as const }];
    const report = computeRoleChurnIndex(prev, next);
    return report.churnIndex === 100 && report.churnedActorIds.includes('player');
  });

  check(results, 'a18_role_churn_stable', 'Role churn: unchanged roles score zero churn', () => {
    const roles = [{ actorId: 'mate', primaryRole: 'earner' as const, secondaryRole: null, responsibility: '', reason: '', taskIds: [], startTurn: 1, reviewCondition: '', temporary: false, confidence: 1, explicit: false, exclusiveSlotId: null }];
    const report = computeRoleChurnIndex(roles, roles);
    return report.churnIndex === 0 && report.stableActorCount === 1;
  });

  check(results, 'a18_lease_expiry_warn', 'Lease watchdog: near-expiry lease flagged', () => {
    const report = evaluateLeaseExpiry(5, [
      {
        id: 'lease1',
        kind: 'region_exclusive',
        holderActorId: 'player',
        regionId: 'NSW',
        taskId: 't1',
        sinceTurn: 1,
        expiresTurn: 5,
        reason: 'test',
      },
    ]);
    return report.expiringLeaseIds.includes('lease1') && report.leaseHealthScore < 100;
  });

  check(results, 'a18_lease_expired', 'Lease watchdog: expired lease lowers health score', () => {
    const report = evaluateLeaseExpiry(6, [
      {
        id: 'lease_old',
        kind: 'handoff_pending',
        holderActorId: 'mate',
        regionId: null,
        taskId: null,
        sinceTurn: 2,
        expiresTurn: 4,
        reason: 'test',
      },
    ]);
    return report.expiredLeaseIds.includes('lease_old') && report.leaseHealthScore === 0;
  });

  check(results, 'a18_coordination_composite', 'Coordination composite: perfect inputs score 100', () => {
    const report = computeCoordinationComposite({
      handoffSlaCompliance: 100,
      handoffReadinessAverage: 100,
      mutexStabilityIndex: 100,
      workstreamBarrierCompliance: 100,
      capacityBalanceScore: 100,
      leaseHealthScore: 100,
      roleChurnIndex: 0,
    });
    return report.compositeScore === 100;
  });

  check(results, 'a18_coordination_composite_weak', 'Coordination composite: weak SLA surfaces weakest dimension', () => {
    const report = computeCoordinationComposite({
      handoffSlaCompliance: 10,
      handoffReadinessAverage: 100,
      mutexStabilityIndex: 100,
      workstreamBarrierCompliance: 100,
    });
    return report.weakestDimension === 'handoff_sla' && report.compositeScore < 90;
  });

  check(results, 'a18_eval_round6_meta', 'Layer: round-6 meta exposes churn, lease, composite fields', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.roleChurnIndex === 'number' &&
      typeof m.leaseHealthScore === 'number' &&
      typeof m.coordinationCompositeScore === 'number'
    );
  });

  check(results, 'a18_audit_role_churn', 'Audit: high role churn surfaces warning finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, roleChurnIndex: 75, roleChurnActorIds: ['player'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /role churn/.test(f.message));
  });

  check(results, 'a18_dual_round6_combined', 'Dual team: round-6 combined composite and lease health exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.coordinationCompositeCombined === 'number' &&
      typeof dual.leaseHealthCombined === 'number' &&
      typeof dual.roleChurnCombined === 'number'
    );
  });

  check(results, 'a18_directive_collision', 'Directive collision: same region proposals from two actors', () => {
    const report = computeDirectiveCollisionIndex([
      { id: 'd1', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't1', priority: 1 },
      { id: 'd2', actorId: 'b', goalKind: 'defend_region', targetRegionId: 'NSW', taskId: 't2', priority: 2 },
    ]);
    return report.collisionIndex > 0 && report.collidingProposalIds.length === 2;
  });

  check(results, 'a18_directive_collision_none', 'Directive collision: disjoint targets score zero', () => {
    const report = computeDirectiveCollisionIndex([
      { id: 'd1', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't1', priority: 1 },
      { id: 'd2', actorId: 'b', goalKind: 'take_region', targetRegionId: 'VIC', taskId: 't2', priority: 2 },
    ]);
    return report.collisionIndex === 0;
  });

  check(results, 'a18_handoff_integrity_self', 'Handoff integrity: self-handoff lowers score', () => {
    const report = evaluateHandoffChainIntegrity(
      [
        {
          id: 'h_self',
          fromActorId: 'player',
          toActorId: 'player',
          regionId: 'NSW',
          taskId: 't1',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      ['player', 'mate'],
    );
    return report.brokenHandoffIds.includes('h_self') && report.integrityScore < 100;
  });

  check(results, 'a18_handoff_integrity_dup', 'Handoff integrity: duplicate pending task flagged', () => {
    const handoff = {
      fromActorId: 'player',
      toActorId: 'mate',
      regionId: 'NSW',
      taskId: 't_dup',
      status: 'pending' as const,
      requestedTurn: 1,
      reason: 'test',
    };
    const report = evaluateHandoffChainIntegrity(
      [
        { ...handoff, id: 'h1' },
        { ...handoff, id: 'h2', fromActorId: 'mate', toActorId: 'player' },
      ],
      ['player', 'mate'],
    );
    return report.duplicatePendingTaskIds.includes('t_dup');
  });

  check(results, 'a18_escalation_critical', 'Escalation tier: audit errors force critical tier', () => {
    const report = computeCoordinationEscalationTier({
      coordinationCompositeScore: 90,
      auditErrors: 1,
      auditWarnings: 0,
    });
    return report.tier === 3 && report.label === 'critical';
  });

  check(results, 'a18_escalation_nominal', 'Escalation tier: healthy team stays nominal', () => {
    const report = computeCoordinationEscalationTier({
      coordinationCompositeScore: 92,
      auditErrors: 0,
      auditWarnings: 0,
      directiveCollisionIndex: 0,
      handoffIntegrityScore: 100,
    });
    return report.tier === 0;
  });

  check(results, 'a18_eval_round7_meta', 'Layer: round-7 meta exposes collision, integrity, escalation', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.directiveCollisionIndex === 'number' &&
      typeof m.handoffIntegrityScore === 'number' &&
      typeof m.coordinationEscalationTier === 'number'
    );
  });

  check(results, 'a18_audit_escalation', 'Audit: critical escalation tier surfaces error finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, coordinationEscalationTier: 3, coordinationEscalationLabel: 'critical' },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'error' && /escalation critical/.test(f.message));
  });

  check(results, 'a18_dual_round7_combined', 'Dual team: round-7 combined collision, integrity, escalation exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.directiveCollisionCombined === 'number' &&
      typeof dual.handoffIntegrityCombined === 'number' &&
      typeof dual.escalationTierCombined === 'number'
    );
  });

  check(results, 'a18_recovery_playbook_critical', 'Recovery playbook: critical tier yields halt actions', () => {
    const report = buildCoordinationRecoveryPlaybook({
      escalationTier: 3,
      coordinationCompositeScore: 40,
      coordinationWeakestDimension: 'mutexStability',
      directiveCollisionIndex: 60,
      handoffIntegrityScore: 40,
    });
    return report.recoveryUrgency >= 75 && report.recommendedActions.includes('halt_noncritical_directives');
  });

  check(results, 'a18_recovery_playbook_nominal', 'Recovery playbook: nominal tier stays low urgency', () => {
    const report = buildCoordinationRecoveryPlaybook({
      escalationTier: 0,
      coordinationCompositeScore: 92,
      directiveCollisionIndex: 0,
      handoffIntegrityScore: 100,
    });
    return report.recoveryUrgency < 40;
  });

  check(results, 'a18_priority_inversion_detect', 'Priority inversion: suppressed higher priority than allowed peer', () => {
    const proposals = [
      { id: 'd_hi', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 1 },
      { id: 'd_lo', actorId: 'b', goalKind: 'defend_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 4 },
    ];
    const report = computeDirectivePriorityInversion(proposals, ['d_hi', 'd_lo'], {
      allowed: [proposals[1]],
      suppressed: [proposals[0]],
    });
    return report.inversionIndex > 0 && report.invertedProposalIds.includes('d_hi');
  });

  check(results, 'a18_priority_inversion_none', 'Priority inversion: aligned allow/suppress scores zero', () => {
    const proposals = [
      { id: 'd_hi', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 1 },
      { id: 'd_lo', actorId: 'b', goalKind: 'defend_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 4 },
    ];
    const report = computeDirectivePriorityInversion(proposals, ['d_hi', 'd_lo'], {
      allowed: [proposals[0]],
      suppressed: [proposals[1]],
    });
    return report.inversionIndex === 0;
  });

  check(results, 'a18_handoff_orphan_detect', 'Handoff orphan: target not assigned to task', () => {
    const report = detectHandoffOrphans(
      [
        {
          id: 'h_orphan',
          fromActorId: 'player',
          toActorId: 'mate',
          regionId: 'NSW',
          taskId: 'task_defend_NSW',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      baseInputs().tasks,
      [{ actorId: 'player', primaryRole: 'controller', responsibility: 'lead', taskIds: ['task_defend_NSW'], lockedUntilTurn: null }],
    );
    return report.orphanCount === 1 && report.orphanHandoffIds.includes('h_orphan');
  });

  check(results, 'a18_eval_round8_meta', 'Layer: round-8 meta exposes recovery, inversion, orphan signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.coordinationRecoveryUrgency === 'number' &&
      typeof m.directivePriorityInversionIndex === 'number' &&
      typeof m.handoffOrphanCount === 'number'
    );
  });

  check(results, 'a18_audit_recovery_urgency', 'Audit: high recovery urgency surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, coordinationRecoveryUrgency: 90 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /recovery urgency/.test(f.message));
  });

  check(results, 'a18_dual_round8_combined', 'Dual team: round-8 combined recovery, inversion, orphan exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.recoveryUrgencyCombined === 'number' &&
      typeof dual.priorityInversionCombined === 'number' &&
      typeof dual.handoffOrphanCombined === 'number'
    );
  });

  check(results, 'a18_workstream_deadlock_cycle', 'Workstream deadlock: mutual barrier dependency detected', () => {
    const report = detectWorkstreamDeadlocks([
      {
        id: 'ws_a',
        actorIds: ['a'],
        taskIds: ['task_a'],
        phase: 'waiting_barrier',
        barrierTaskIds: ['task_b'],
      },
      {
        id: 'ws_b',
        actorIds: ['b'],
        taskIds: ['task_b'],
        phase: 'waiting_barrier',
        barrierTaskIds: ['task_a'],
      },
    ]);
    return report.deadlockCount >= 2 && report.deadlockedWorkstreamIds.includes('ws_a');
  });

  check(results, 'a18_workstream_deadlock_none', 'Workstream deadlock: independent streams score zero', () => {
    const report = detectWorkstreamDeadlocks([
      {
        id: 'ws_a',
        actorIds: ['a'],
        taskIds: ['task_a'],
        phase: 'active',
        barrierTaskIds: [],
      },
    ]);
    return report.deadlockCount === 0;
  });

  check(results, 'a18_lease_contention_mutex', 'Lease contention: pending handoff vs mutex holder', () => {
    const report = computeLeaseContentionIndex(
      [],
      [
        {
          id: 'h1',
          fromActorId: 'a',
          toActorId: 'mate',
          regionId: 'NSW',
          taskId: 't1',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      { NSW: 'player' },
    );
    return report.contentionIndex > 0 && report.contendedRegionIds.includes('NSW');
  });

  check(results, 'a18_lease_contention_clear', 'Lease contention: aligned handoff scores zero', () => {
    const report = computeLeaseContentionIndex(
      [],
      [
        {
          id: 'h1',
          fromActorId: 'a',
          toActorId: 'player',
          regionId: 'NSW',
          taskId: 't1',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      { NSW: 'player' },
    );
    return report.contentionIndex === 0;
  });

  check(results, 'a18_coordination_saturation_high', 'Coordination saturation: near-limit load scores high', () => {
    const report = measureCoordinationSaturation({
      directiveProposalCount: 8,
      pendingHandoffCount: 6,
      activeLeaseCount: 12,
      activeWorkstreamCount: 4,
      suppressedDirectiveCount: 4,
    });
    return report.saturationIndex >= 75;
  });

  check(results, 'a18_coordination_saturation_low', 'Coordination saturation: light load stays low', () => {
    const report = measureCoordinationSaturation({
      directiveProposalCount: 1,
      pendingHandoffCount: 0,
      activeLeaseCount: 1,
      activeWorkstreamCount: 1,
    });
    return report.saturationIndex < 40;
  });

  check(results, 'a18_eval_round9_meta', 'Layer: round-9 meta exposes deadlock, contention, saturation signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.workstreamDeadlockCount === 'number' &&
      typeof m.leaseContentionIndex === 'number' &&
      typeof m.coordinationSaturationIndex === 'number'
    );
  });

  check(results, 'a18_audit_workstream_deadlock', 'Audit: workstream deadlock surfaces error', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, workstreamDeadlockCount: 2, deadlockedWorkstreamIds: ['ws_a', 'ws_b'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'error' && /deadlock/.test(f.message));
  });

  check(results, 'a18_dual_round9_combined', 'Dual team: round-9 combined deadlock, contention, saturation exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.workstreamDeadlockCombined === 'number' &&
      typeof dual.leaseContentionCombined === 'number' &&
      typeof dual.coordinationSaturationCombined === 'number'
    );
  });

  check(results, 'a18_mutex_lease_divergence_detect', 'Mutex/lease divergence: holder mismatch flagged', () => {
    const report = computeMutexLeaseDivergenceIndex(
      { NSW: 'player' },
      [
        {
          id: 'lease_nsw',
          kind: 'region_mutex',
          holderActorId: 'mate',
          regionId: 'NSW',
          taskId: 't1',
          sinceTurn: 1,
          expiresTurn: 5,
          reason: 'test',
        },
      ],
    );
    return report.divergenceIndex > 0 && report.divergentRegionIds.includes('NSW');
  });

  check(results, 'a18_mutex_lease_divergence_aligned', 'Mutex/lease divergence: aligned holders score zero', () => {
    const report = computeMutexLeaseDivergenceIndex(
      { NSW: 'player' },
      [
        {
          id: 'lease_nsw',
          kind: 'region_mutex',
          holderActorId: 'player',
          regionId: 'NSW',
          taskId: 't1',
          sinceTurn: 1,
          expiresTurn: 5,
          reason: 'test',
        },
      ],
    );
    return report.divergenceIndex === 0;
  });

  check(results, 'a18_handoff_cascade_chain', 'Handoff cascade: long pending chain raises risk', () => {
    const report = analyzeHandoffCascadeRisk([
      {
        id: 'h1',
        fromActorId: 'a',
        toActorId: 'b',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
      {
        id: 'h2',
        fromActorId: 'b',
        toActorId: 'c',
        regionId: 'VIC',
        taskId: 't2',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
      {
        id: 'h3',
        fromActorId: 'c',
        toActorId: 'd',
        regionId: 'QLD',
        taskId: 't3',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
    ]);
    return report.cascadeRiskIndex >= 55 && report.cascadeChainActorIds.length >= 3;
  });

  check(results, 'a18_handoff_cascade_none', 'Handoff cascade: single hop stays low risk', () => {
    const report = analyzeHandoffCascadeRisk([
      {
        id: 'h1',
        fromActorId: 'a',
        toActorId: 'b',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
    ]);
    return report.cascadeRiskIndex < 30;
  });

  check(results, 'a18_suppression_backlog_high', 'Suppression backlog: near-cap load scores high', () => {
    const report = computeSuppressionBacklogIndex({
      suppressedDirectiveIds: Array.from({ length: 20 }, (_, i) => `d_${i}`),
      droppedDirectiveCount: 4,
      quotaExhaustedActorIds: ['a', 'b', 'c'],
    });
    return report.backlogIndex >= 70;
  });

  check(results, 'a18_suppression_backlog_low', 'Suppression backlog: light load stays low', () => {
    const report = computeSuppressionBacklogIndex({
      suppressedDirectiveIds: ['d1'],
      droppedDirectiveCount: 0,
      quotaExhaustedActorIds: [],
    });
    return report.backlogIndex < 40;
  });

  check(results, 'a18_eval_round10_meta', 'Layer: round-10 meta exposes divergence, cascade, backlog signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.mutexLeaseDivergenceIndex === 'number' &&
      typeof m.handoffCascadeRiskIndex === 'number' &&
      typeof m.suppressionBacklogIndex === 'number'
    );
  });

  check(results, 'a18_audit_suppression_backlog', 'Audit: high suppression backlog surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, suppressionBacklogIndex: 85 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /suppression backlog/.test(f.message));
  });

  check(results, 'a18_dual_round10_combined', 'Dual team: round-10 combined divergence, cascade, backlog exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.mutexLeaseDivergenceCombined === 'number' &&
      typeof dual.handoffCascadeRiskCombined === 'number' &&
      typeof dual.suppressionBacklogCombined === 'number'
    );
  });

  return results;
}

function emptyGuard(turn: number) {
  return { version: 1 as const, committedKeys: [], generationByActor: {}, turn, reservations: {} };
}

export function summarizeAgent18SelfTests(results: Agent18SelfTestResult[]): {
  passed: number;
  failed: number;
  total: number;
} {
  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length };
}
