import type { Agent17GoalDefinition } from '../types/command-center-types.ts';

/** Measurable Agent 17 delivery goals — verified by `validation/goal-verification.ts`, not prose-only. */
export const AGENT17_GOAL_REGISTRY: Agent17GoalDefinition[] = [
  {
    id: 'G17-001',
    title: 'Ops state sanitizer pins version to v1',
    category: 'validation',
    acceptance: 'Unknown version fields downgrade to version 1 with safe defaults.',
    severity: 'critical',
  },
  {
    id: 'G17-002',
    title: 'Fingerprint reacts to canonical state deltas',
    category: 'planning',
    acceptance: 'Money and lastExecutedAction changes produce distinct fingerprints.',
    severity: 'critical',
  },
  {
    id: 'G17-003',
    title: 'Objective spawns multi-step plan',
    category: 'planning',
    acceptance: 'Tracked objective yields ≥3 steps with in_progress head.',
    severity: 'critical',
  },
  {
    id: 'G17-004',
    title: 'Verification gate on unchanged fingerprint',
    category: 'validation',
    acceptance: 'No verification log entries when fingerprint unchanged.',
    severity: 'major',
  },
  {
    id: 'G17-005',
    title: 'Deep context slices populated',
    category: 'telemetry',
    acceptance: 'Evaluation snapshot includes ≥1 weighted context slice.',
    severity: 'major',
  },
  {
    id: 'G17-006',
    title: 'Auto-delegate when plan active',
    category: 'planning',
    acceptance: 'First evaluation creates copilot delegated project when plan incomplete.',
    severity: 'major',
  },
  {
    id: 'G17-007',
    title: 'Template catalog instantiates plans',
    category: 'planning',
    acceptance: 'Each catalog template id returns a non-empty step list.',
    severity: 'major',
  },
  {
    id: 'G17-008',
    title: 'Rollback restores prior ops checkpoint',
    category: 'rollback',
    acceptance: 'Rollback controller restores activePlan id from checkpoint.',
    severity: 'critical',
  },
  {
    id: 'G17-009',
    title: 'Checkpoint stack bounded',
    category: 'rollback',
    acceptance: 'Store retains at most 16 checkpoints (FIFO eviction).',
    severity: 'minor',
  },
  {
    id: 'G17-010',
    title: 'Disabled command center skips mutation',
    category: 'validation',
    acceptance: 'enabled=false yields empty plan and zero delegations.',
    severity: 'major',
  },
  {
    id: 'G17-011',
    title: 'Autonomy maps delegate recommendation',
    category: 'integration',
    acceptance: 'delegated→team_os, assisted→copilot, advisory→strategy_planner.',
    severity: 'minor',
  },
  {
    id: 'G17-012',
    title: 'Modular dev harness reports pass/fail counts',
    category: 'integration',
    acceptance: 'Dev test report exposes totalTests and success boolean.',
    severity: 'critical',
  },
  {
    id: 'G17-013',
    title: 'Deep templates expose prerequisite chains',
    category: 'planning',
    acceptance: 'Six-step capital program wires prerequisiteStepIds on late phases.',
    severity: 'major',
  },
  {
    id: 'G17-014',
    title: 'Recovery signals drive template selection',
    category: 'planning',
    acceptance: 'Blocked plan uses highest-severity lane template (severity-sorted signals).',
    severity: 'major',
  },
  {
    id: 'G17-015',
    title: 'Blocked plan recovery replan in evaluator',
    category: 'validation',
    acceptance: 'evaluateAcc17CommandCenterOperations sets recovery objectiveSource.',
    severity: 'critical',
  },
  {
    id: 'G17-016',
    title: 'Planning depth snapshot on evaluation',
    category: 'telemetry',
    acceptance: 'Snapshot includes planningDepth with catalogDepth.templateCount ≥ 12.',
    severity: 'major',
  },
  {
    id: 'G17-017',
    title: 'Template routing by objective category',
    category: 'planning',
    acceptance: 'Trade-flavored objective routes to trade category candidates.',
    severity: 'major',
  },
  {
    id: 'G17-018',
    title: 'Delegation analytics matrix complete',
    category: 'integration',
    acceptance: 'buildAgent17DelegationAnalytics returns five delegate kinds.',
    severity: 'minor',
  },
];

export function getAgent17GoalById(id: string): Agent17GoalDefinition | undefined {
  return AGENT17_GOAL_REGISTRY.find(g => g.id === id);
}

export function listAgent17GoalIds(): string[] {
  return AGENT17_GOAL_REGISTRY.map(g => g.id);
}
