import { acceptHandoff, coordinationHealthScore, orchestrateTeamCoordination } from './coordination-orchestrator.ts';
import {
  arbitrateRegionLead,
  buildMutexMapWithPriorityArbitration,
  compareArbitrationCandidates,
  missionTierForTask,
} from './priority-arbitration.ts';
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
