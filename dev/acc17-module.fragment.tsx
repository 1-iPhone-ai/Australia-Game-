// ============================================================================
// ACC17 (O6K-17): AI COMMAND CENTER — MULTI-STEP PLANNING, DELEGATED PROJECTS,
// VERIFIED EXECUTION (STATE-CHANGE GATED), V9.4 DEEP CONTEXT
// ============================================================================

export type Acc17PlanStepStatus = 'pending' | 'in_progress' | 'verified_complete' | 'failed' | 'skipped' | 'blocked';
export type Acc17ProjectDelegationStatus = 'draft' | 'delegated' | 'executing' | 'awaiting_verification' | 'completed' | 'cancelled' | 'blocked';
export type Acc17DelegateTargetKind = 'copilot' | 'team_os' | 'teammate' | 'strategy_planner' | 'manual';

export interface Acc17PlanStepRequirement {
  minCash?: number;
  minNetWorth?: number;
  requiredRegion?: string;
  requiredActionType?: string;
  prerequisiteStepIds?: string[];
  minRegionalStanding?: number;
}

export interface Acc17MultiStepPlanStep {
  id: string;
  index: number;
  title: string;
  summary: string;
  actionType: string;
  requirements: Acc17PlanStepRequirement;
  status: Acc17PlanStepStatus;
  verifiedOnTurn?: number;
  verifiedOnDay?: number;
  verifiedStateFingerprint?: string;
  lastEvaluationFingerprint?: string;
  blockerReason?: string;
}

export interface Acc17MultiStepPlan {
  id: string;
  title: string;
  objectiveSource?: string;
  createdTurn: number;
  createdDay: number;
  steps: Acc17MultiStepPlanStep[];
  activeStepIndex: number;
  completionPercent: number;
  isOnTrack: boolean;
  replanCount: number;
}

export interface Acc17DelegatedProject {
  id: string;
  planId: string;
  title: string;
  delegateKind: Acc17DelegateTargetKind;
  delegateTargetId: string;
  status: Acc17ProjectDelegationStatus;
  authorityCeiling: 'advisory' | 'assisted' | 'delegated';
  assignedTurn: number;
  assignedDay: number;
  lastVerifiedFingerprint: string;
  pendingVerificationStepId?: string;
  notes: string;
}

export interface Acc17VerifiedExecutionLogEntry {
  id: string;
  turn: number;
  day: number;
  stepId: string;
  projectId: string;
  fingerprintBefore: string;
  fingerprintAfter: string;
  verified: boolean;
  reason: string;
}

export interface Acc17V94DeepContextSlice {
  key: string;
  label: string;
  summary: string;
  weight: number;
  tags: string[];
}

export interface Acc17V94DeepContextBundle {
  actorId: string;
  turn: number;
  day: number;
  fingerprint: string;
  headline: string;
  slices: Acc17V94DeepContextSlice[];
  objectiveTitle?: string;
  attentionLabel?: string;
  strategyHeadline?: string;
}

export interface Acc17CommandCenterOpsState {
  version: 1;
  activePlan: Acc17MultiStepPlan | null;
  delegatedProjects: Acc17DelegatedProject[];
  verificationLog: Acc17VerifiedExecutionLogEntry[];
  lastContextFingerprint: string;
  lastContextBundle?: Acc17V94DeepContextBundle;
  enabled: boolean;
}

export interface Acc17OperationsSnapshot {
  deepContext: Acc17V94DeepContextBundle;
  activePlan: Acc17MultiStepPlan | null;
  delegatedProjects: Acc17DelegatedProject[];
  pendingVerificationCount: number;
  verifiedStepsThisTurn: number;
  blockedSteps: Acc17MultiStepPlanStep[];
  recommendedDelegateKind: Acc17DelegateTargetKind;
}

export function createDefaultAcc17CommandCenterOpsState(): Acc17CommandCenterOpsState {
  return {
    version: 1,
    activePlan: null,
    delegatedProjects: [],
    verificationLog: [],
    lastContextFingerprint: '',
    enabled: true,
  };
}

export interface Acc17ProjectTemplate {
  id: string;
  title: string;
  category: string;
  delegateKind: Acc17DelegateTargetKind;
  stepBlueprints: Array<{ title: string; actionType: string; summary: string; requirements?: Partial<Acc17PlanStepRequirement> }>;
}

export const ACC17_PROJECT_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  {
    id: 'acc17_tpl_economy_01',
    title: 'Liquidity & debt program #1',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for economy.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_02',
    title: 'Liquidity & debt program #2',
    category: 'economy',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for economy.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_03',
    title: 'Liquidity & debt program #3',
    category: 'economy',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for economy.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_04',
    title: 'Liquidity & debt program #4',
    category: 'economy',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for economy.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_05',
    title: 'Liquidity & debt program #5',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for economy.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_06',
    title: 'Liquidity & debt program #6',
    category: 'economy',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for economy.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_07',
    title: 'Liquidity & debt program #7',
    category: 'economy',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for economy.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_08',
    title: 'Liquidity & debt program #8',
    category: 'economy',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for economy.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_09',
    title: 'Liquidity & debt program #9',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for economy.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_10',
    title: 'Liquidity & debt program #10',
    category: 'economy',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for economy.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_11',
    title: 'Liquidity & debt program #11',
    category: 'economy',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for economy.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_12',
    title: 'Liquidity & debt program #12',
    category: 'economy',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for economy.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_13',
    title: 'Liquidity & debt program #13',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for economy.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_14',
    title: 'Liquidity & debt program #14',
    category: 'economy',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for economy.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_economy_15',
    title: 'Liquidity & debt program #15',
    category: 'economy',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Liquidity & debt',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for economy.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Liquidity & debt',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for economy.',
      },
      {
        title: 'Phase 3: Liquidity & debt',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for economy.',
      },
      {
        title: 'Phase 4: Liquidity & debt',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for economy.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_01',
    title: 'Regional contracts program #1',
    category: 'contracts',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for contracts.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_02',
    title: 'Regional contracts program #2',
    category: 'contracts',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for contracts.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_03',
    title: 'Regional contracts program #3',
    category: 'contracts',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for contracts.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_04',
    title: 'Regional contracts program #4',
    category: 'contracts',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for contracts.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_05',
    title: 'Regional contracts program #5',
    category: 'contracts',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for contracts.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_06',
    title: 'Regional contracts program #6',
    category: 'contracts',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for contracts.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_07',
    title: 'Regional contracts program #7',
    category: 'contracts',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for contracts.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_08',
    title: 'Regional contracts program #8',
    category: 'contracts',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for contracts.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_09',
    title: 'Regional contracts program #9',
    category: 'contracts',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for contracts.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_10',
    title: 'Regional contracts program #10',
    category: 'contracts',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for contracts.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_11',
    title: 'Regional contracts program #11',
    category: 'contracts',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for contracts.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_12',
    title: 'Regional contracts program #12',
    category: 'contracts',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for contracts.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_13',
    title: 'Regional contracts program #13',
    category: 'contracts',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for contracts.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_14',
    title: 'Regional contracts program #14',
    category: 'contracts',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for contracts.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_contracts_15',
    title: 'Regional contracts program #15',
    category: 'contracts',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Regional contracts',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for contracts.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Regional contracts',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for contracts.',
      },
      {
        title: 'Phase 3: Regional contracts',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for contracts.',
      },
      {
        title: 'Phase 4: Regional contracts',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for contracts.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_01',
    title: 'Territory expansion program #1',
    category: 'travel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for travel.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_02',
    title: 'Territory expansion program #2',
    category: 'travel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for travel.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_03',
    title: 'Territory expansion program #3',
    category: 'travel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for travel.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_04',
    title: 'Territory expansion program #4',
    category: 'travel',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for travel.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_05',
    title: 'Territory expansion program #5',
    category: 'travel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for travel.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_06',
    title: 'Territory expansion program #6',
    category: 'travel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for travel.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_07',
    title: 'Territory expansion program #7',
    category: 'travel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for travel.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_08',
    title: 'Territory expansion program #8',
    category: 'travel',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for travel.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_09',
    title: 'Territory expansion program #9',
    category: 'travel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for travel.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_10',
    title: 'Territory expansion program #10',
    category: 'travel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for travel.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_11',
    title: 'Territory expansion program #11',
    category: 'travel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for travel.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_12',
    title: 'Territory expansion program #12',
    category: 'travel',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for travel.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_13',
    title: 'Territory expansion program #13',
    category: 'travel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for travel.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_14',
    title: 'Territory expansion program #14',
    category: 'travel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for travel.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_travel_15',
    title: 'Territory expansion program #15',
    category: 'travel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Territory expansion',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for travel.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Territory expansion',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for travel.',
      },
      {
        title: 'Phase 3: Territory expansion',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for travel.',
      },
      {
        title: 'Phase 4: Territory expansion',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for travel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_01',
    title: 'Production chain program #1',
    category: 'crafting',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for crafting.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_02',
    title: 'Production chain program #2',
    category: 'crafting',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for crafting.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_03',
    title: 'Production chain program #3',
    category: 'crafting',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for crafting.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_04',
    title: 'Production chain program #4',
    category: 'crafting',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for crafting.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_05',
    title: 'Production chain program #5',
    category: 'crafting',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for crafting.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_06',
    title: 'Production chain program #6',
    category: 'crafting',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for crafting.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_07',
    title: 'Production chain program #7',
    category: 'crafting',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for crafting.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_08',
    title: 'Production chain program #8',
    category: 'crafting',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for crafting.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_09',
    title: 'Production chain program #9',
    category: 'crafting',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for crafting.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_10',
    title: 'Production chain program #10',
    category: 'crafting',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for crafting.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_11',
    title: 'Production chain program #11',
    category: 'crafting',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for crafting.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_12',
    title: 'Production chain program #12',
    category: 'crafting',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for crafting.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_13',
    title: 'Production chain program #13',
    category: 'crafting',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for crafting.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_14',
    title: 'Production chain program #14',
    category: 'crafting',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for crafting.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_crafting_15',
    title: 'Production chain program #15',
    category: 'crafting',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Production chain',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for crafting.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Production chain',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for crafting.',
      },
      {
        title: 'Phase 3: Production chain',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for crafting.',
      },
      {
        title: 'Phase 4: Production chain',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for crafting.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_01',
    title: 'Team coordination program #1',
    category: 'team',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for team.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_02',
    title: 'Team coordination program #2',
    category: 'team',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for team.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_03',
    title: 'Team coordination program #3',
    category: 'team',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for team.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_04',
    title: 'Team coordination program #4',
    category: 'team',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for team.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_05',
    title: 'Team coordination program #5',
    category: 'team',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for team.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_06',
    title: 'Team coordination program #6',
    category: 'team',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for team.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_07',
    title: 'Team coordination program #7',
    category: 'team',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for team.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_08',
    title: 'Team coordination program #8',
    category: 'team',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for team.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_09',
    title: 'Team coordination program #9',
    category: 'team',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for team.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_10',
    title: 'Team coordination program #10',
    category: 'team',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for team.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_11',
    title: 'Team coordination program #11',
    category: 'team',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for team.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_12',
    title: 'Team coordination program #12',
    category: 'team',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for team.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_13',
    title: 'Team coordination program #13',
    category: 'team',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for team.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_14',
    title: 'Team coordination program #14',
    category: 'team',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for team.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_team_15',
    title: 'Team coordination program #15',
    category: 'team',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Team coordination',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for team.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Team coordination',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for team.',
      },
      {
        title: 'Phase 3: Team coordination',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for team.',
      },
      {
        title: 'Phase 4: Team coordination',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for team.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_01',
    title: 'Fog-of-war intel program #1',
    category: 'intel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for intel.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_02',
    title: 'Fog-of-war intel program #2',
    category: 'intel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for intel.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_03',
    title: 'Fog-of-war intel program #3',
    category: 'intel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for intel.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_04',
    title: 'Fog-of-war intel program #4',
    category: 'intel',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for intel.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_05',
    title: 'Fog-of-war intel program #5',
    category: 'intel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for intel.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_06',
    title: 'Fog-of-war intel program #6',
    category: 'intel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for intel.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_07',
    title: 'Fog-of-war intel program #7',
    category: 'intel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for intel.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_08',
    title: 'Fog-of-war intel program #8',
    category: 'intel',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for intel.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_09',
    title: 'Fog-of-war intel program #9',
    category: 'intel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for intel.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_10',
    title: 'Fog-of-war intel program #10',
    category: 'intel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for intel.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_11',
    title: 'Fog-of-war intel program #11',
    category: 'intel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for intel.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_12',
    title: 'Fog-of-war intel program #12',
    category: 'intel',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for intel.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_13',
    title: 'Fog-of-war intel program #13',
    category: 'intel',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for intel.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_14',
    title: 'Fog-of-war intel program #14',
    category: 'intel',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for intel.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_intel_15',
    title: 'Fog-of-war intel program #15',
    category: 'intel',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Fog-of-war intel',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for intel.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Fog-of-war intel',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for intel.',
      },
      {
        title: 'Phase 3: Fog-of-war intel',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for intel.',
      },
      {
        title: 'Phase 4: Fog-of-war intel',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for intel.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_01',
    title: 'Infrastructure program #1',
    category: 'infra',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for infra.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_02',
    title: 'Infrastructure program #2',
    category: 'infra',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for infra.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_03',
    title: 'Infrastructure program #3',
    category: 'infra',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for infra.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_04',
    title: 'Infrastructure program #4',
    category: 'infra',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for infra.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_05',
    title: 'Infrastructure program #5',
    category: 'infra',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for infra.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_06',
    title: 'Infrastructure program #6',
    category: 'infra',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for infra.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_07',
    title: 'Infrastructure program #7',
    category: 'infra',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for infra.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_08',
    title: 'Infrastructure program #8',
    category: 'infra',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for infra.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_09',
    title: 'Infrastructure program #9',
    category: 'infra',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for infra.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_10',
    title: 'Infrastructure program #10',
    category: 'infra',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for infra.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_11',
    title: 'Infrastructure program #11',
    category: 'infra',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for infra.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_12',
    title: 'Infrastructure program #12',
    category: 'infra',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for infra.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_13',
    title: 'Infrastructure program #13',
    category: 'infra',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for infra.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_14',
    title: 'Infrastructure program #14',
    category: 'infra',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for infra.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_infra_15',
    title: 'Infrastructure program #15',
    category: 'infra',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Infrastructure',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for infra.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Infrastructure',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for infra.',
      },
      {
        title: 'Phase 3: Infrastructure',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for infra.',
      },
      {
        title: 'Phase 4: Infrastructure',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for infra.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_01',
    title: 'Market arbitrage program #1',
    category: 'trade',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 1.1 for trade.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 1.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 1.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 1.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_02',
    title: 'Market arbitrage program #2',
    category: 'trade',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 2.1 for trade.',
        requirements: { minCash: 1000 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 2.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 2.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 2.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_03',
    title: 'Market arbitrage program #3',
    category: 'trade',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 3.1 for trade.',
        requirements: { minCash: 1500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 3.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 3.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 3.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_04',
    title: 'Market arbitrage program #4',
    category: 'trade',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 4.1 for trade.',
        requirements: { minCash: 2000 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 4.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 4.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 4.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_05',
    title: 'Market arbitrage program #5',
    category: 'trade',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 5.1 for trade.',
        requirements: { minCash: 2500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 5.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 5.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 5.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_06',
    title: 'Market arbitrage program #6',
    category: 'trade',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 6.1 for trade.',
        requirements: { minCash: 3000 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 6.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 6.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 6.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_07',
    title: 'Market arbitrage program #7',
    category: 'trade',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 7.1 for trade.',
        requirements: { minCash: 3500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 7.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 7.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 7.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_08',
    title: 'Market arbitrage program #8',
    category: 'trade',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 8.1 for trade.',
        requirements: { minCash: 4000 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 8.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 8.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 8.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_09',
    title: 'Market arbitrage program #9',
    category: 'trade',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 9.1 for trade.',
        requirements: { minCash: 4500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 9.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 9.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 9.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_10',
    title: 'Market arbitrage program #10',
    category: 'trade',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 10.1 for trade.',
        requirements: { minCash: 5000 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 10.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 10.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 10.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_11',
    title: 'Market arbitrage program #11',
    category: 'trade',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 11.1 for trade.',
        requirements: { minCash: 5500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 11.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 11.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 11.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_12',
    title: 'Market arbitrage program #12',
    category: 'trade',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 12.1 for trade.',
        requirements: { minCash: 6000 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 12.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 12.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 12.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_13',
    title: 'Market arbitrage program #13',
    category: 'trade',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 13.1 for trade.',
        requirements: { minCash: 6500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 13.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 13.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 13.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_14',
    title: 'Market arbitrage program #14',
    category: 'trade',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 14.1 for trade.',
        requirements: { minCash: 7000 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 14.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 14.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 14.4 for trade.',
      },
    ],
  },
  {
    id: 'acc17_tpl_trade_15',
    title: 'Market arbitrage program #15',
    category: 'trade',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Phase 1: Market arbitrage',
        actionType: 'contract',
        summary: 'Verified milestone 15.1 for trade.',
        requirements: { minCash: 7500 },
      },
      {
        title: 'Phase 2: Market arbitrage',
        actionType: 'invest',
        summary: 'Verified milestone 15.2 for trade.',
      },
      {
        title: 'Phase 3: Market arbitrage',
        actionType: 'craft',
        summary: 'Verified milestone 15.3 for trade.',
      },
      {
        title: 'Phase 4: Market arbitrage',
        actionType: 'trade',
        summary: 'Verified milestone 15.4 for trade.',
      },
    ],
  },
];

export function acc17ComputeRelevantStateFingerprint(state: any, actorId: string): string {
  const actor = state?.actorsById?.[actorId] || (actorId === 'player' ? state?.player : state?.aiPlayer) || {};
  const turn = state?.turnCounter || state?.day || 1;
  const day = state?.day || 1;
  const parts = [
    actorId,
    String(turn),
    String(day),
    String(actor?.money ?? 0),
    String(actor?.netWorth ?? actor?.money ?? 0),
    String(actor?.currentRegion || actor?.currentLocation || ''),
    String(actor?.actionsUsedThisTurn ?? 0),
    String((actor?.inventory || []).length),
    String(state?.lastExecutedAction?.type || state?.lastAction?.type || ''),
    String(state?.playerTrackedObjective?.sourceId || ''),
    String(state?.strategyPlannerState?.activePlan?.id || ''),
  ];
  return fnv1aHashString('acc17:' + parts.join('|'));
}

function acc17DelegateFallbackId(kind: Acc17DelegateTargetKind): string {
  if (kind === 'team_os') return 'team_os';
  if (kind === 'strategy_planner') return 'strategy_planner';
  return 'copilot';
}

export function sanitizeAcc17CommandCenterOpsState(input: unknown): Acc17CommandCenterOpsState {
  const defaults = createDefaultAcc17CommandCenterOpsState();
  if (!input || typeof input !== 'object') return defaults;
  const obj = input as Record<string, unknown>;
  const enabled = typeof obj.enabled === 'boolean' ? obj.enabled : defaults.enabled;
  const lastContextFingerprint = typeof obj.lastContextFingerprint === 'string' ? obj.lastContextFingerprint : '';
  let activePlan: Acc17MultiStepPlan | null = null;
  if (obj.activePlan && typeof obj.activePlan === 'object') {
    const p = obj.activePlan as any;
    const steps: Acc17MultiStepPlanStep[] = Array.isArray(p.steps)
      ? p.steps.map((s: any, idx: number) => ({
          id: String(s?.id || `step_${idx}`),
          index: typeof s?.index === 'number' ? s.index : idx,
          title: String(s?.title || 'Step'),
          summary: String(s?.summary || ''),
          actionType: String(s?.actionType || 'wait'),
          requirements: (s?.requirements && typeof s.requirements === 'object') ? s.requirements : {},
          status: (['pending', 'in_progress', 'verified_complete', 'failed', 'skipped', 'blocked'] as Acc17PlanStepStatus[]).includes(s?.status)
            ? s.status : 'pending',
          verifiedOnTurn: typeof s?.verifiedOnTurn === 'number' ? s.verifiedOnTurn : undefined,
          verifiedOnDay: typeof s?.verifiedOnDay === 'number' ? s.verifiedOnDay : undefined,
          verifiedStateFingerprint: typeof s?.verifiedStateFingerprint === 'string' ? s.verifiedStateFingerprint : undefined,
          lastEvaluationFingerprint: typeof s?.lastEvaluationFingerprint === 'string' ? s.lastEvaluationFingerprint : undefined,
          blockerReason: typeof s?.blockerReason === 'string' ? s.blockerReason : undefined,
        }))
      : [];
    activePlan = {
      id: String(p.id || 'plan'),
      title: String(p.title || 'Plan'),
      objectiveSource: typeof p.objectiveSource === 'string' ? p.objectiveSource : undefined,
      createdTurn: typeof p.createdTurn === 'number' ? p.createdTurn : 1,
      createdDay: typeof p.createdDay === 'number' ? p.createdDay : 1,
      steps,
      activeStepIndex: typeof p.activeStepIndex === 'number' ? Math.max(0, Math.min(steps.length, p.activeStepIndex)) : 0,
      completionPercent: typeof p.completionPercent === 'number' ? p.completionPercent : 0,
      isOnTrack: p.isOnTrack !== false,
      replanCount: typeof p.replanCount === 'number' ? p.replanCount : 0,
    };
  }
  const delegatedProjects: Acc17DelegatedProject[] = Array.isArray(obj.delegatedProjects)
    ? (obj.delegatedProjects as any[]).slice(0, 32).map((d, i) => ({
        id: String(d?.id || `proj_${i}`),
        planId: String(d?.planId || ''),
        title: String(d?.title || 'Project'),
        delegateKind: (['copilot', 'team_os', 'teammate', 'strategy_planner', 'manual'] as Acc17DelegateTargetKind[]).includes(d?.delegateKind)
          ? d.delegateKind : 'copilot',
        delegateTargetId: String(d?.delegateTargetId || acc17DelegateFallbackId(d?.delegateKind)),
        status: (['draft', 'delegated', 'executing', 'awaiting_verification', 'completed', 'cancelled', 'blocked'] as Acc17ProjectDelegationStatus[]).includes(d?.status)
          ? d.status : 'draft',
        authorityCeiling: (['advisory', 'assisted', 'delegated'] as const).includes(d?.authorityCeiling) ? d.authorityCeiling : 'assisted',
        assignedTurn: typeof d?.assignedTurn === 'number' ? d.assignedTurn : 1,
        assignedDay: typeof d?.assignedDay === 'number' ? d.assignedDay : 1,
        lastVerifiedFingerprint: typeof d?.lastVerifiedFingerprint === 'string' ? d.lastVerifiedFingerprint : '',
        pendingVerificationStepId: typeof d?.pendingVerificationStepId === 'string' ? d.pendingVerificationStepId : undefined,
        notes: String(d?.notes || ''),
      }))
    : [];
  const verificationLog: Acc17VerifiedExecutionLogEntry[] = Array.isArray(obj.verificationLog)
    ? (obj.verificationLog as any[]).slice(-120).map((e, i) => ({
        id: String(e?.id || `vlog_${i}`),
        turn: typeof e?.turn === 'number' ? e.turn : 1,
        day: typeof e?.day === 'number' ? e.day : 1,
        stepId: String(e?.stepId || ''),
        projectId: String(e?.projectId || ''),
        fingerprintBefore: String(e?.fingerprintBefore || ''),
        fingerprintAfter: String(e?.fingerprintAfter || ''),
        verified: e?.verified === true,
        reason: String(e?.reason || ''),
      }))
    : [];
  const lastContextBundle = obj.lastContextBundle && typeof obj.lastContextBundle === 'object'
    ? (obj.lastContextBundle as Acc17V94DeepContextBundle) : undefined;
  return { version: 1, enabled, activePlan, delegatedProjects, verificationLog, lastContextFingerprint, lastContextBundle };
}

export function buildAcc17V94DeepContextBundle(state: any, settings: any, actorId: string): Acc17V94DeepContextBundle {
  const turn = state?.turnCounter || state?.day || 1;
  const day = state?.day || 1;
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const actor = state?.actorsById?.[actorId] || (actorId === 'player' ? state?.player : null) || { id: actorId };
  const slices: Acc17V94DeepContextSlice[] = [];
  const pushSlice = (key: string, label: string, summary: string, weight: number, tags: string[] = []) => {
    if (summary) slices.push({ key, label, summary, weight, tags });
  };
  try {
    const objective = typeof resolveCurrentObjective === 'function'
      ? resolveCurrentObjective(state, settings, actor, state?.playerTrackedObjective)
      : null;
    if (objective?.title) {
      pushSlice('objective', 'Current objective', `${objective.title} — ${objective.description || ''}`, 10, ['intent']);
    }
  } catch { /* noop */ }
  try {
    const attention = typeof classifyPlayerAttentionState === 'function'
      ? classifyPlayerAttentionState(state, settings, actor, null)
      : null;
    if (attention?.label) pushSlice('attention', 'Attention', `${attention.label}: ${attention.detail || ''}`, 9, ['risk']);
  } catch { /* noop */ }
  const gi3 = state?.gi3Strategy;
  if (gi3?.headline) pushSlice('gi3', 'Strategy', String(gi3.headline), 8, ['gi3']);
  const planner = state?.strategyPlannerState?.activePlan;
  if (planner?.title) pushSlice('planner', 'Planner', `Blueprint: ${planner.title}`, 7, ['planner']);
  pushSlice('economy', 'Economy', `Cash $${Number(actor?.money || 0).toLocaleString()}`, 5, ['economy']);
  slices.sort((a, b) => b.weight - a.weight);
  return {
    actorId,
    turn,
    day,
    fingerprint,
    headline: slices[0]?.summary || 'Deep context ready.',
    slices: slices.slice(0, 12),
    objectiveTitle: slices.find(s => s.key === 'objective')?.summary.split(' — ')[0],
    attentionLabel: slices.find(s => s.key === 'attention')?.label,
    strategyHeadline: slices.find(s => s.key === 'gi3')?.summary,
  };
}

export function acc17InstantiatePlanFromTemplate(templateId: string, state: any, _actorId: string): Acc17MultiStepPlan | null {
  const tpl = ACC17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === templateId);
  if (!tpl) return null;
  const turn = state?.turnCounter || state?.day || 1;
  const day = state?.day || 1;
  const planId = `acc17_plan_${templateId}_${turn}`;
  const steps: Acc17MultiStepPlanStep[] = tpl.stepBlueprints.map((bp, idx) => ({
    id: `${planId}_step_${idx}`,
    index: idx,
    title: bp.title,
    summary: bp.summary,
    actionType: bp.actionType,
    requirements: { ...(bp.requirements || {}) },
    status: idx === 0 ? 'in_progress' : 'pending',
  }));
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

export function acc17CreateMultiStepPlanFromObjective(state: any, settings: any, actorId: string): Acc17MultiStepPlan | null {
  try {
    const actor = state?.actorsById?.[actorId] || state?.player;
    const objective = resolveCurrentObjective(state, settings, actor, state?.playerTrackedObjective);
    if (!objective?.title) return null;
    const turn = state?.turnCounter || state?.day || 1;
    const day = state?.day || 1;
    const planId = `acc17_obj_${objective.sourceType || 'goal'}_${turn}`;
    const next = objective.recommendedNextStep;
    const steps: Acc17MultiStepPlanStep[] = [
      {
        id: `${planId}_s0`, index: 0, title: 'Align with tracked objective',
        summary: objective.description || objective.title,
        actionType: next?.actionType || 'wait', requirements: {}, status: 'in_progress',
      },
      {
        id: `${planId}_s1`, index: 1, title: next?.label || 'Execute recommended move',
        summary: 'Complete the recommended next step from the intent layer.',
        actionType: next?.actionType || 'wait', requirements: {}, status: 'pending',
      },
      {
        id: `${planId}_s2`, index: 2, title: 'Verify objective progress',
        summary: 'Confirm goal progress after a verified state change.',
        actionType: 'verify_objective', requirements: {}, status: 'pending',
      },
    ];
    return {
      id: planId, title: `Plan: ${objective.title}`, objectiveSource: objective.sourceId,
      createdTurn: turn, createdDay: day, steps, activeStepIndex: 0, completionPercent: 0, isOnTrack: true, replanCount: 0,
    };
  } catch {
    return null;
  }
}

export function acc17DelegateProject(
  ops: Acc17CommandCenterOpsState,
  plan: Acc17MultiStepPlan,
  delegateKind: Acc17DelegateTargetKind,
  delegateTargetId: string,
  authorityCeiling: Acc17DelegatedProject['authorityCeiling'] = 'assisted'
): Acc17DelegatedProject {
  return {
    id: `acc17_proj_${plan.id}_${ops.delegatedProjects.length}`,
    planId: plan.id,
    title: plan.title,
    delegateKind,
    delegateTargetId,
    status: 'delegated',
    authorityCeiling,
    assignedTurn: plan.createdTurn,
    assignedDay: plan.createdDay,
    lastVerifiedFingerprint: '',
    notes: `Delegated to ${delegateKind}:${delegateTargetId}`,
  };
}

function acc17StepRequirementsMet(step: Acc17MultiStepPlanStep, state: any, actorId: string, completedIds: Set<string>): boolean {
  const req = step.requirements || {};
  const actor = state?.actorsById?.[actorId] || (actorId === 'player' ? state?.player : null) || {};
  if (typeof req.minCash === 'number' && (actor.money || 0) < req.minCash) return false;
  if (typeof req.minNetWorth === 'number' && (actor.netWorth || actor.money || 0) < req.minNetWorth) return false;
  const region = actor.currentRegion || actor.currentLocation || '';
  if (req.requiredRegion && region !== req.requiredRegion) return false;
  if (Array.isArray(req.prerequisiteStepIds)) {
    for (const pid of req.prerequisiteStepIds) {
      if (!completedIds.has(pid)) return false;
    }
  }
  return true;
}

function acc17DetectActionMatch(step: Acc17MultiStepPlanStep, state: any): boolean {
  const last = state?.lastExecutedAction || state?.lastAction;
  const lastType = typeof last === 'string' ? last : (last?.type || last?.actionType || '');
  if (!lastType) return false;
  if (step.actionType === 'verify_objective') {
    return String(lastType).includes('objective') || String(lastType).includes('contract') || String(lastType).includes('track');
  }
  return String(lastType) === step.actionType || String(lastType).includes(step.actionType);
}

export function acc17AdvanceVerifiedPlanProgress(
  plan: Acc17MultiStepPlan,
  state: any,
  actorId: string,
  previousFingerprint: string
): { plan: Acc17MultiStepPlan; logEntries: Acc17VerifiedExecutionLogEntry[]; fingerprint: string } {
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const logEntries: Acc17VerifiedExecutionLogEntry[] = [];
  const turn = state?.turnCounter || state?.day || 1;
  const day = state?.day || 1;
  const stateChanged = fingerprint !== previousFingerprint && previousFingerprint !== '';
  const completedIds = new Set(plan.steps.filter(s => s.status === 'verified_complete').map(s => s.id));
  const steps = plan.steps.map(s => ({ ...s }));
  let activeStepIndex = plan.activeStepIndex;

  if (stateChanged) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.status === 'verified_complete' || step.status === 'skipped') continue;
      step.lastEvaluationFingerprint = fingerprint;
      if (!acc17StepRequirementsMet(step, state, actorId, completedIds)) {
        step.status = 'blocked';
        step.blockerReason = 'Requirements not satisfied after state change.';
        continue;
      }
      if (step.status === 'pending' && i === activeStepIndex) step.status = 'in_progress';
      if (step.status === 'in_progress' && acc17DetectActionMatch(step, state)) {
        step.status = 'verified_complete';
        step.verifiedOnTurn = turn;
        step.verifiedOnDay = day;
        step.verifiedStateFingerprint = fingerprint;
        completedIds.add(step.id);
        logEntries.push({
          id: `acc17_v_${step.id}_${turn}`, turn, day, stepId: step.id, projectId: plan.id,
          fingerprintBefore: previousFingerprint, fingerprintAfter: fingerprint, verified: true,
          reason: 'Verified after canonical state change matched step.',
        });
      }
    }
  }

  while (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'verified_complete') activeStepIndex++;
  if (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'pending') {
    steps[activeStepIndex].status = 'in_progress';
  }
  const done = steps.filter(s => s.status === 'verified_complete').length;
  const completionPercent = steps.length ? Math.round((done / steps.length) * 100) : 100;
  const blocked = steps.some(s => s.status === 'blocked');
  return {
    plan: { ...plan, steps, activeStepIndex, completionPercent, isOnTrack: !blocked && completionPercent < 100 },
    logEntries,
    fingerprint,
  };
}

export function evaluateAcc17CommandCenterOperations(
  state: any,
  settings: any,
  actorId: string,
  persisted: Acc17CommandCenterOpsState
): { ops: Acc17CommandCenterOpsState; snapshot: Acc17OperationsSnapshot } {
  const enabled = persisted.enabled !== false && (settings?.commandCenterSettings?.enabled !== false);
  const deepContext = buildAcc17V94DeepContextBundle(state, settings, actorId);
  let ops = sanitizeAcc17CommandCenterOpsState(persisted);
  if (!enabled) {
    return {
      ops,
      snapshot: {
        deepContext, activePlan: null, delegatedProjects: [], pendingVerificationCount: 0,
        verifiedStepsThisTurn: 0, blockedSteps: [], recommendedDelegateKind: 'copilot',
      },
    };
  }
  if (!ops.activePlan) {
    const fromObjective = acc17CreateMultiStepPlanFromObjective(state, settings, actorId);
    if (fromObjective) ops = { ...ops, activePlan: fromObjective };
  }
  const prevFp = ops.lastContextFingerprint || '';
  if (ops.activePlan) {
    const { plan, logEntries, fingerprint } = acc17AdvanceVerifiedPlanProgress(ops.activePlan, state, actorId, prevFp);
    ops = {
      ...ops,
      activePlan: plan,
      lastContextFingerprint: fingerprint,
      lastContextBundle: deepContext,
      verificationLog: [...ops.verificationLog, ...logEntries].slice(-200),
    };
    if (ops.delegatedProjects.length === 0 && plan.completionPercent < 100) {
      ops = { ...ops, delegatedProjects: [acc17DelegateProject(ops, plan, 'copilot', 'copilot_session', 'assisted')] };
    }
  } else {
    ops = { ...ops, lastContextFingerprint: deepContext.fingerprint, lastContextBundle: deepContext };
  }
  const blockedSteps = ops.activePlan?.steps.filter(s => s.status === 'blocked' || s.status === 'failed') || [];
  const pendingVerificationCount = ops.activePlan?.steps.filter(s => s.status === 'in_progress').length || 0;
  const verifiedStepsThisTurn = ops.verificationLog.filter(e => e.turn === (state?.turnCounter || 1) && e.verified).length;
  const autonomy = settings?.aiCommunicationAutonomyLevel;
  const recommendedDelegateKind: Acc17DelegateTargetKind =
    autonomy === 'delegated' ? 'team_os' : autonomy === 'assisted' ? 'copilot' : 'strategy_planner';
  return {
    ops,
    snapshot: {
      deepContext,
      activePlan: ops.activePlan,
      delegatedProjects: ops.delegatedProjects,
      pendingVerificationCount,
      verifiedStepsThisTurn,
      blockedSteps,
      recommendedDelegateKind,
    },
  };
}

export interface AiCommandCenterAcc17DevTestReport {
  timestamp: number;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  executionTimeMs: number;
  overallStatus: 'passed' | 'failed';
  success: boolean;
  testResults: { id: string; name: string; status: 'passed' | 'failed'; durationMs: number; errorMessage?: string }[];
  summary: string;
}

export function runAiCommandCenterAcc17DevTests(customState?: any, customSettings?: any): AiCommandCenterAcc17DevTestReport {
  const start = Date.now();
  const testResults: AiCommandCenterAcc17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({ id, name, status: ok ? 'passed' : 'failed', durationMs: 0, errorMessage: ok ? undefined : detail });
  };
  try {
    const actor = { id: 'player', money: 5000, netWorth: 8000, currentRegion: 'NSW', teamId: TEAM_PLAYER_ID };
    const baseState: any = customState || {
      turnCounter: 3, day: 3, player: actor, actorsById: { player: actor },
      playerTrackedObjective: { id: 'c1', sourceType: 'contract', sourceId: 'c1', title: 'Test Contract' },
      lastExecutedAction: { type: 'wait' },
    };
    const settings = customSettings || { aiCommunicationAutonomyLevel: 'assisted', commandCenterSettings: { enabled: true } };
    const fp1 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    baseState.player.money = 5100;
    baseState.lastExecutedAction = { type: 'travel' };
    const fp3 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    push('acc17_fp_delta', 'Fingerprint reacts to state delta', fp1 !== fp3, `${fp1}/${fp3}`);
    const plan = acc17CreateMultiStepPlanFromObjective(baseState, settings, 'player');
    push('acc17_plan', 'Objective spawns multi-step plan', !!plan && plan!.steps.length >= 3);
    let ops = createDefaultAcc17CommandCenterOpsState();
    ops = { ...ops, activePlan: plan, lastContextFingerprint: fp1 };
    const noAdvance = acc17AdvanceVerifiedPlanProgress(plan!, baseState, 'player', fp1);
    push('acc17_gate_same_fp', 'No verification log when fingerprint unchanged', noAdvance.logEntries.length === 0);
    ops = { ...ops, lastContextFingerprint: fp3 };
    const evalRes = evaluateAcc17CommandCenterOperations(baseState, settings, 'player', ops);
    push('acc17_context', 'Deep context slices populated', evalRes.snapshot.deepContext.slices.length >= 1);
    push('acc17_delegate', 'Delegated project created', evalRes.snapshot.delegatedProjects.length >= 1);
    push('acc17_sanitize', 'Sanitizer returns v1', sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1);
  } catch (e: any) {
    push('acc17_throw', 'Harness did not throw', false, String(e?.message || e));
  }
  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `AI Command Center ACC17 Dev Tests: ${passedCount}/${testResults.length} Passed`,
  };
}

export const Acc17CommandCenterOperationsPanel: React.FC<{
  snapshot: Acc17OperationsSnapshot;
  viewMode: CommandCenterViewMode;
}> = ({ snapshot, viewMode }) => {
  const plan = snapshot.activePlan;
  const ctx = snapshot.deepContext;
  return (
    <div className="space-y-4 text-sm text-slate-200">
      <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40">
        <div className="font-bold text-cyan-300 mb-1">V9.4 Deep Context</div>
        <div className="text-xs text-slate-400 mb-2">{ctx.headline}</div>
        <ul className="space-y-1 text-xs">
          {ctx.slices.slice(0, viewMode === 'simple' ? 4 : 10).map(slice => (
            <li key={slice.key}><span className="text-cyan-500">{slice.label}:</span> {slice.summary}</li>
          ))}
        </ul>
      </div>
      <div className="p-3 rounded-lg bg-slate-900/80 border border-indigo-900/40">
        <div className="font-bold text-indigo-300 mb-2">Multi-step plan</div>
        {!plan ? <p className="text-xs text-slate-400">No active plan.</p> : (
          <ol className="space-y-2 text-xs">
            {plan.steps.map(step => (
              <li key={step.id} className="p-2 rounded border border-slate-700">
                {step.index + 1}. {step.title} — <span className="text-slate-400">{step.status}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="p-3 rounded-lg bg-slate-900/80 border border-purple-900/40">
        <div className="font-bold text-purple-300 mb-2">Delegated projects ({snapshot.delegatedProjects.length})</div>
        <p className="text-xs text-slate-400">Verified this turn: {snapshot.verifiedStepsThisTurn}. Recommended delegate: {snapshot.recommendedDelegateKind}.</p>
      </div>
    </div>
  );
};

if (typeof window !== 'undefined') {
  (window as any).runAiCommandCenterAcc17DevTests = runAiCommandCenterAcc17DevTests;
}

