import type { Acc17ProjectTemplate } from '../types/command-center-types.ts';

/**
 * Multi-phase planning templates (4–6 steps, explicit prerequisite chains).
 * Merged into `AGENT17_PROJECT_TEMPLATE_CATALOG` at module load.
 */
export const AGENT17_DEEP_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  {
    id: 'agent17_tpl_deep_capital_program',
    title: 'Deep capital program (6-phase)',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Cash audit',
        actionType: 'contract',
        summary: 'Establish baseline liquidity and runway.',
        requirements: { minCash: 250 },
      },
      {
        title: 'Phase 2: Liability scan',
        actionType: 'invest',
        summary: 'Map short-term obligations against reserves.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Phase 3: Asset liquidation window',
        actionType: 'sell_market',
        summary: 'Raise cash without breaching strategy constraints.',
        requirements: { prerequisiteStepIndices: [1], minCash: 400 },
      },
      {
        title: 'Phase 4: Regional deposit push',
        actionType: 'deposit',
        summary: 'Convert liquid cash into secured regional position.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Phase 5: Team treasury sync',
        actionType: 'invest',
        summary: 'Align team OS treasury with player runway target.',
        requirements: { prerequisiteStepIndices: [3] },
      },
      {
        title: 'Phase 6: Capital program verification',
        actionType: 'verify_objective',
        summary: 'Close the program with verified net-worth delta.',
        requirements: { prerequisiteStepIndices: [4] },
      },
    ],
  },
  {
    id: 'agent17_tpl_regional_recovery',
    title: 'Regional retreat and re-entry',
    category: 'recovery',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Withdraw to safe region',
        actionType: 'travel',
        summary: 'Reduce exposure in contested territory.',
      },
      {
        title: 'Fortify home deposit',
        actionType: 'deposit',
        summary: 'Rebuild VP buffer in controlled region.',
        requirements: { prerequisiteStepIndices: [0], minCash: 800 },
      },
      {
        title: 'Restock for counter-push',
        actionType: 'restock_supplies',
        summary: 'Prepare supply margin before re-entry.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Verify regional recovery',
        actionType: 'verify_objective',
        summary: 'Confirm standing and cash recovered.',
        requirements: { prerequisiteStepIndices: [2] },
      },
    ],
  },
  {
    id: 'agent17_tpl_debt_recovery',
    title: 'Debt pressure relief lane',
    category: 'recovery',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Pause discretionary spend',
        actionType: 'wait',
        summary: 'Stop non-essential actions until ratio improves.',
      },
      {
        title: 'Service minimum obligations',
        actionType: 'contract',
        summary: 'Meet contractual cash outflows first.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Sell non-core inventory',
        actionType: 'sell_market',
        summary: 'Raise cash from market liquidation.',
        requirements: { prerequisiteStepIndices: [1], minNetWorth: 2000 },
      },
      {
        title: 'Verify debt ratio',
        actionType: 'verify_objective',
        summary: 'Confirm debt pressure telemetry normalized.',
        requirements: { prerequisiteStepIndices: [2] },
      },
    ],
  },
  {
    id: 'agent17_tpl_crisis_stabilization',
    title: 'Crisis stabilization sequence',
    category: 'recovery',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Identify crisis driver',
        actionType: 'wait',
        summary: 'Classify liquidity vs supply vs regional crisis.',
      },
      {
        title: 'Emergency restock',
        actionType: 'restock_supplies',
        summary: 'Prevent condition collapse on active routes.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Emergency cash raise',
        actionType: 'sell_market',
        summary: 'Fund immediate recovery actions.',
        requirements: { prerequisiteStepIndices: [1], minCash: 100 },
      },
      {
        title: 'Stabilizing travel',
        actionType: 'travel',
        summary: 'Move to region with best recovery outlook.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Crisis exit verification',
        actionType: 'verify_objective',
        summary: 'Mark crisis lane complete after fingerprint proof.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
  {
    id: 'agent17_tpl_supply_deep_recovery',
    title: 'Deep supply chain recovery',
    category: 'recovery',
    delegateKind: 'manual',
    stepBlueprints: [
      {
        title: 'Audit supply margin',
        actionType: 'wait',
        summary: 'Quantify supply shortfall vs next expedition.',
      },
      {
        title: 'Bulk restock',
        actionType: 'restock_supplies',
        summary: 'Restore supply above critical threshold.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Craft sustainment kit',
        actionType: 'craft',
        summary: 'Convert materials into sustainment gear.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Trade for missing inputs',
        actionType: 'trade',
        summary: 'Fill gaps via regional market.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Verify supply recovery',
        actionType: 'verify_objective',
        summary: 'Confirm supply lane closed.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
];

export type DeepTemplateBlueprint = Acc17ProjectTemplate['stepBlueprints'][number] & {
  requirements?: Acc17ProjectTemplate['stepBlueprints'][number]['requirements'] & {
    prerequisiteStepIndices?: number[];
  };
};
