import { acceptHandoff, coordinationHealthScore, orchestrateTeamCoordination } from './coordination-orchestrator.ts';
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
    const good = coordinationHealthScore({ leases: [], handoffs: [], workstreams: [], mutexRegions: {}, warnings: [] });
    const bad = coordinationHealthScore({
      leases: [],
      handoffs: [],
      workstreams: [],
      mutexRegions: {},
      warnings: ['a', 'b', 'c', 'd', 'e'],
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
