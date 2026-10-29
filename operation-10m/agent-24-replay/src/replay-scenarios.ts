import { o6kAgent24Fingerprint } from './fingerprint.ts';

export type Agent24ReplayScenarioId =
  | 'baseline_match'
  | 'branch_heavy'
  | 'late_game_overtime'
  | 'causal_chain_stress'
  | 'multi_session_resume';

export interface Agent24ReplayScenarioDefinition {
  id: Agent24ReplayScenarioId;
  title: string;
  description: string;
  /** Minimum replay events expected when scenario is satisfied. */
  minReplayEvents: number;
  /** Minimum branch nodes when applicable. */
  minBranchNodes: number;
  requiresLateGame: boolean;
  requiresCausalDepth: number;
}

export interface Agent24ReplayScenarioInput {
  replayEventCount: number;
  branchNodeCount: number;
  isLateGame: boolean;
  maxCausalDepth: number;
  sessionCount: number;
}

export interface Agent24ReplayScenarioAssessment {
  scenarioId: Agent24ReplayScenarioId;
  satisfied: boolean;
  score: number;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScenarioSuiteResult {
  suiteId: string;
  assessments: Agent24ReplayScenarioAssessment[];
  satisfiedCount: number;
  deterministicFingerprint: string;
}

export const AGENT24_REPLAY_SCENARIO_CATALOG: Agent24ReplayScenarioDefinition[] = [
  {
    id: 'baseline_match',
    title: 'Baseline match replay',
    description: 'Standard single-timeline match with checkpoints.',
    minReplayEvents: 1,
    minBranchNodes: 0,
    requiresLateGame: false,
    requiresCausalDepth: 0,
  },
  {
    id: 'branch_heavy',
    title: 'Branch-heavy what-if',
    description: 'Multiple replay branches recorded.',
    minReplayEvents: 2,
    minBranchNodes: 2,
    requiresLateGame: false,
    requiresCausalDepth: 0,
  },
  {
    id: 'late_game_overtime',
    title: 'Late game / overtime',
    description: 'Endgame phase with checkpoint coverage.',
    minReplayEvents: 1,
    minBranchNodes: 0,
    requiresLateGame: true,
    requiresCausalDepth: 0,
  },
  {
    id: 'causal_chain_stress',
    title: 'Deep causal chains',
    description: 'Ledger causal depth stress for audit replay.',
    minReplayEvents: 0,
    minBranchNodes: 0,
    requiresLateGame: false,
    requiresCausalDepth: 2,
  },
  {
    id: 'multi_session_resume',
    title: 'Multi-session resume',
    description: 'Match spans more than one persisted session.',
    minReplayEvents: 1,
    minBranchNodes: 0,
    requiresLateGame: false,
    requiresCausalDepth: 0,
  },
];

function assessOne(def: Agent24ReplayScenarioDefinition, input: Agent24ReplayScenarioInput): Agent24ReplayScenarioAssessment {
  let satisfied = true;
  const checks: string[] = [];

  if (input.replayEventCount < def.minReplayEvents) {
    satisfied = false;
    checks.push(`replayEvents ${input.replayEventCount}<${def.minReplayEvents}`);
  }
  if (input.branchNodeCount < def.minBranchNodes) {
    satisfied = false;
    checks.push(`branches ${input.branchNodeCount}<${def.minBranchNodes}`);
  }
  if (def.requiresLateGame && !input.isLateGame) {
    satisfied = false;
    checks.push('lateGame required');
  }
  if (input.maxCausalDepth < def.requiresCausalDepth) {
    satisfied = false;
    checks.push(`causalDepth ${input.maxCausalDepth}<${def.requiresCausalDepth}`);
  }
  if (def.id === 'multi_session_resume' && input.sessionCount < 2) {
    satisfied = false;
    checks.push(`sessions ${input.sessionCount}<2`);
  }

  const score = satisfied ? 100 : Math.max(0, 100 - checks.length * 25);
  const payload = { id: def.id, satisfied, score, checks };
  return {
    scenarioId: def.id,
    satisfied,
    score,
    detail: satisfied ? 'Scenario satisfied.' : checks.join('; '),
    fingerprint: o6kAgent24Fingerprint('replay_scenario', payload),
  };
}

export function runAgent24ReplayScenarioSuite(input: Agent24ReplayScenarioInput): Agent24ReplayScenarioSuiteResult {
  const assessments = AGENT24_REPLAY_SCENARIO_CATALOG.map(def => assessOne(def, input)).sort((a, b) =>
    a.scenarioId.localeCompare(b.scenarioId),
  );
  const satisfiedCount = assessments.filter(a => a.satisfied).length;
  const payload = assessments.map(a => ({ id: a.scenarioId, fp: a.fingerprint, ok: a.satisfied }));
  return {
    suiteId: o6kAgent24Fingerprint('scenario_suite', { satisfiedCount, payload }),
    assessments,
    satisfiedCount,
    deterministicFingerprint: o6kAgent24Fingerprint('scenario_suite_body', payload),
  };
}
