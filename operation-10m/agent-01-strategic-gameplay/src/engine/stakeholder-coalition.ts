import type {
  StakeholderGroupId,
  StakeholderSentiment,
} from '../types/coalition-mandate.ts';
import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';
import type { StrategicGameplayContracts } from '../contracts/index.ts';

const BASE_SENTIMENT = 55;

const TAG_STAKEHOLDER_SHIFT: Record<string, Partial<Record<StakeholderGroupId, number>>> = {
  infrastructure: { regions: 6, industry: 2 },
  logistics: { industry: 5, regions: 3 },
  innovation: { industry: 8, households: -2 },
  contingency: { public_services: 4, households: 3 },
  buffer: { households: 5, industry: 2 },
  national_priority: { public_services: 3, regions: 4 },
};

const CONFLICTING_STAKEHOLDER: Partial<
  Record<StakeholderGroupId, { drop: number; groups: StakeholderGroupId[] }>
> = {
  households: { drop: 8, groups: ['households'] },
};

export function createDefaultStakeholderSentiment(): StakeholderSentiment {
  return {
    industry: BASE_SENTIMENT,
    households: BASE_SENTIMENT,
    regions: BASE_SENTIMENT,
    public_services: BASE_SENTIMENT,
  };
}

function clampSentiment(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function primaryStakeholdersForAction(
  action: StrategicActionDefinition,
): StakeholderGroupId[] {
  const groups = new Set<StakeholderGroupId>();
  for (const tag of action.tags) {
    const shift = TAG_STAKEHOLDER_SHIFT[tag];
    if (shift) {
      for (const g of Object.keys(shift) as StakeholderGroupId[]) groups.add(g);
    }
  }
  if (groups.size === 0) groups.add('public_services');
  return [...groups];
}

export function applyStakeholderReaction(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicGameplayState {
  const sentiment: StakeholderSentiment = {
    ...(state.stakeholderSentiment ?? createDefaultStakeholderSentiment()),
  };

  for (const tag of action.tags) {
    const shift = TAG_STAKEHOLDER_SHIFT[tag];
    if (!shift) continue;
    for (const [group, delta] of Object.entries(shift) as [StakeholderGroupId, number][]) {
      sentiment[group] = clampSentiment(sentiment[group] + delta);
    }
  }

  if (action.conflictingPriorities.length > 0) {
    sentiment.households = clampSentiment(sentiment.households - 4);
  }

  return { ...state, stakeholderSentiment: sentiment };
}

export function stakeholderApprovalPenalty(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const groups = primaryStakeholdersForAction(action);
  let penalty = 0;
  for (const group of groups) {
    const value = sentiment[group];
    if (value < 35) penalty += 6;
    else if (value < 45) penalty += 3;
  }
  if (action.conflictingPriorities.length > 0 && sentiment.households < 50) {
    penalty += CONFLICTING_STAKEHOLDER.households?.drop ? 2 : 0;
  }
  return penalty;
}

export function stakeholderOppositionIssues(
  action: StrategicActionDefinition,
  contracts: StrategicGameplayContracts,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  const penalty = stakeholderApprovalPenalty(state, action);
  if (penalty === 0) return [];
  const gov = contracts.government.snapshot();
  const required = action.minApproval + penalty;
  if (gov.approvalRating >= required) return [];
  return [
    {
      code: 'STAKEHOLDER_OPPOSITION',
      message: `Coalition sentiment requires approval ${required} (currently ${gov.approvalRating}).`,
      requirement: { kind: 'min_approval', rating: required },
    },
  ];
}

export function listStakeholderWarnings(state: StrategicGameplayState): string[] {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const warnings: string[] = [];
  for (const [group, value] of Object.entries(sentiment) as [StakeholderGroupId, number][]) {
    if (value < 40) {
      warnings.push(`${group.replace('_', ' ')} coalition wary (${value}/100).`);
    }
  }
  return warnings;
}
