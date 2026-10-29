#!/usr/bin/env python3
"""Generate ACC17 fragment for V9.4 TSX insertion."""
from pathlib import Path

out: list[str] = []
W = out.append

W("// ============================================================================")
W("// ACC17 (O6K-17): AI COMMAND CENTER — MULTI-STEP PLANNING, DELEGATED PROJECTS,")
W("// VERIFIED EXECUTION (STATE-CHANGE GATED), V9.4 DEEP CONTEXT")
W("// ============================================================================")
W("")

# Types block - abbreviated in script, full content
types = r'''
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
'''
W(types.strip())

W("")
W("export const ACC17_PROJECT_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [")
categories = [
    ("economy", "Liquidity & debt"),
    ("contracts", "Regional contracts"),
    ("travel", "Territory expansion"),
    ("crafting", "Production chain"),
    ("team", "Team coordination"),
    ("intel", "Fog-of-war intel"),
    ("infra", "Infrastructure"),
    ("trade", "Market arbitrage"),
]
for cat, cat_label in categories:
    for i in range(1, 16):
        tid = f"acc17_tpl_{cat}_{i:02d}"
        W("  {")
        W(f"    id: '{tid}',")
        W(f"    title: '{cat_label} program #{i}',")
        W(f"    category: '{cat}',")
        W(f"    delegateKind: '{['copilot','team_os','strategy_planner','teammate'][i % 4]}',")
        W("    stepBlueprints: [")
        for si in range(1, 5):
            action = ["travel", "contract", "invest", "craft", "trade", "deposit"][si % 6]
            W("      {")
            W(f"        title: 'Phase {si}: {cat_label}',")
            W(f"        actionType: '{action}',")
            W(f"        summary: 'Verified milestone {i}.{si} for {cat}.',")
            if si == 1:
                W(f"        requirements: {{ minCash: {500 * i} }},")
            W("      },")
        W("    ],")
        W("  },")
W("];")

logic = Path(__file__).with_name("acc17-logic.ts.txt").read_text()
W(logic)

Path("/workspace/dev/acc17-module.fragment.tsx").write_text("\n".join(out) + "\n")
print("lines", len(out))
