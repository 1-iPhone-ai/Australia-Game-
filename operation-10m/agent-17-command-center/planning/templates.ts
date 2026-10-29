import type {
  Acc17MultiStepPlan,
  Acc17MultiStepPlanStep,
  Acc17ProjectTemplate,
} from '../types/command-center-types.ts';
import type { Agent17GameStateSlice } from '../types/command-center-types.ts';
import { AGENT17_DEEP_TEMPLATE_CATALOG } from './deep-templates.ts';

type StepBlueprint = Acc17ProjectTemplate['stepBlueprints'][number] & {
  requirements?: Acc17ProjectTemplate['stepBlueprints'][number]['requirements'] & {
    prerequisiteStepIndices?: number[];
  };
};

/** Curated template catalog (modular slice; full catalog remains in canonical TSX until assembly). */
export const AGENT17_BASE_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  {
    id: 'agent17_tpl_economy_liquidity',
    title: 'Liquidity stabilization program',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Audit cash runway',
        actionType: 'contract',
        summary: 'Confirm contracts cover minimum liquidity.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Rebalance investments',
        actionType: 'invest',
        summary: 'Shift treasury to liquid instruments.',
      },
      {
        title: 'Verify debt ceiling',
        actionType: 'verify_objective',
        summary: 'Confirm debt ratio under alert threshold.',
      },
    ],
  },
  {
    id: 'agent17_tpl_trade_arbitrage',
    title: 'Regional trade arbitrage',
    category: 'trade',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Scout price delta',
        actionType: 'travel',
        summary: 'Move to opposing region with favorable spread.',
      },
      {
        title: 'Execute market trade',
        actionType: 'trade',
        summary: 'Capture spread before expiration.',
      },
      {
        title: 'Bank proceeds',
        actionType: 'deposit',
        summary: 'Lock gains into regional deposit.',
        requirements: { minCash: 1000 },
      },
    ],
  },
  {
    id: 'agent17_tpl_team_synergy',
    title: 'Team treasury synergy',
    category: 'team',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Align team directive',
        actionType: 'wait',
        summary: 'Confirm team OS directive matches player objective.',
      },
      {
        title: 'Contribute to treasury',
        actionType: 'invest',
        summary: 'Fund shared infrastructure milestone.',
      },
      {
        title: 'Verify alignment score',
        actionType: 'verify_objective',
        summary: 'Check team alignment telemetry.',
      },
    ],
  },
  {
    id: 'agent17_tpl_recovery',
    title: 'Supply and recovery lane',
    category: 'recovery',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Restock expedition supplies',
        actionType: 'restock_supplies',
        summary: 'Avoid condition penalties on long routes.',
      },
      {
        title: 'Craft efficiency upgrade',
        actionType: 'craft',
        summary: 'Improve action efficiency before next push.',
      },
      {
        title: 'Confirm recovery metrics',
        actionType: 'verify_objective',
        summary: 'Validate supplies and net worth recovered.',
      },
    ],
  },
  {
    id: 'agent17_tpl_gi3_strategy',
    title: 'GI3 strategy alignment',
    category: 'intelligence',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Review active strategy headline',
        actionType: 'wait',
        summary: 'Ensure GI3 constraints match next action.',
      },
      {
        title: 'Execute constrained move',
        actionType: 'travel',
        summary: 'Take lowest-divergence action toward milestone.',
      },
      {
        title: 'Verify milestone progress',
        actionType: 'verify_objective',
        summary: 'Record verified fingerprint for strategy phase.',
      },
    ],
  },
];

export const AGENT17_PROJECT_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  ...AGENT17_BASE_TEMPLATE_CATALOG,
  ...AGENT17_DEEP_TEMPLATE_CATALOG,
];

function wirePrerequisiteStepIds(
  steps: Acc17MultiStepPlanStep[],
  blueprints: StepBlueprint[]
): Acc17MultiStepPlanStep[] {
  return steps.map((step, idx) => {
    const indices = blueprints[idx]?.requirements?.prerequisiteStepIndices;
    if (!indices?.length) return step;
    const prerequisiteStepIds = indices
      .filter(i => i >= 0 && i < steps.length)
      .map(i => steps[i].id);
    return {
      ...step,
      requirements: {
        ...step.requirements,
        prerequisiteStepIds,
      },
    };
  }).map(step => {
    const req = { ...step.requirements };
    delete (req as { prerequisiteStepIndices?: number[] }).prerequisiteStepIndices;
    return { ...step, requirements: req };
  });
}

export function acc17InstantiatePlanFromTemplate(
  templateId: string,
  state: Agent17GameStateSlice,
  _actorId: string
): Acc17MultiStepPlan | null {
  const tpl = AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === templateId);
  if (!tpl) return null;
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const planId = `acc17_plan_${templateId}_${turn}`;
  const blueprints = tpl.stepBlueprints as StepBlueprint[];
  let steps: Acc17MultiStepPlanStep[] = blueprints.map((bp, idx) => ({
    id: `${planId}_step_${idx}`,
    index: idx,
    title: bp.title,
    summary: bp.summary,
    actionType: bp.actionType,
    requirements: { ...(bp.requirements || {}) },
    status: idx === 0 ? 'in_progress' : 'pending',
  }));
  steps = wirePrerequisiteStepIds(steps, blueprints);
  return {
    id: planId,
    title: tpl.title,
    objectiveSource: templateId,
    createdTurn: turn,
    createdDay: day,
    steps,
    activeStepIndex: 0,
    completionPercent: 0,
    isOnTrack: true,
    replanCount: 0,
  };
}

export function listAgent17TemplateIds(): string[] {
  return AGENT17_PROJECT_TEMPLATE_CATALOG.map(t => t.id);
}
