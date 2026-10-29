import type {
  InstitutionUpgradeState,
  InstitutionUpgradeTier,
  ResearchBranchId,
  ResearchInstitutionDefinition,
  ResearchProgressInputs,
  UnlockedResearchNode,
} from './types.ts';
import { RESEARCH_NODE_BY_ID } from './branches.ts';
import { RESEARCH_INSTITUTIONS } from './institutions.ts';

export type { InstitutionUpgradeTier } from './types.ts';

export const INSTITUTION_UPGRADE_TIER_RANK: Record<InstitutionUpgradeTier, number> = {
  dormant: 0,
  affiliate: 1,
  partner: 2,
  strategic: 3,
  national_integration: 4,
};

export const INSTITUTION_UPGRADE_LABEL: Record<InstitutionUpgradeTier, string> = {
  dormant: 'Dormant',
  affiliate: 'Affiliate',
  partner: 'Research Partner',
  strategic: 'Strategic Alliance',
  national_integration: 'National Integration',
};

export interface InstitutionUpgradeThresholds {
  partnerStandingDelta: number;
  strategicMinBranchTier: 3 | 4;
  nationalStanding: number;
}

export const DEFAULT_INSTITUTION_UPGRADE_THRESHOLDS: InstitutionUpgradeThresholds = {
  partnerStandingDelta: 12,
  strategicMinBranchTier: 3,
  nationalStanding: 72,
};

export type { InstitutionUpgradeState } from './types.ts';

const ACTIVE_PROJECT = /^(active|upgraded|partial|operational|completed)/i;

function standing(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): number {
  return inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding] ?? 0;
}

function hasPreferredProject(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): boolean {
  return inputs.projects.some(
    p =>
      ACTIVE_PROJECT.test(p.status) &&
      inst.preferredProjectTypes.includes(p.projectType as (typeof inst.preferredProjectTypes)[number])
  );
}

function preferredContractCount(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): number {
  return inputs.completedContracts.filter(c =>
    inst.preferredContractTypes.includes(c.contractType as (typeof inst.preferredContractTypes)[number])
  ).length;
}

function maxUnlockedTierOnBranches(
  unlocked: UnlockedResearchNode[],
  branches: ResearchBranchId[]
): number {
  let max = 0;
  for (const u of unlocked) {
    if (!branches.includes(u.branchId)) continue;
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    if (tier > max) max = tier;
  }
  return max;
}

export function evaluateInstitutionUpgrade(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[],
  inst: ResearchInstitutionDefinition,
  thresholds: InstitutionUpgradeThresholds = DEFAULT_INSTITUTION_UPGRADE_THRESHOLDS
): InstitutionUpgradeState {
  const st = standing(inputs, inst);
  const reasons: string[] = [];

  if (st < inst.minStanding) {
    return {
      institutionId: inst.id,
      tier: 'dormant',
      readinessMultiplier: 0,
      diffusionMultiplier: 0,
      assessedTurn: inputs.turn,
      reasons: ['standing below minimum'],
    };
  }

  let tier: InstitutionUpgradeTier = 'affiliate';
  reasons.push('affiliate standing');

  const partnerFloor = inst.minStanding + thresholds.partnerStandingDelta;
  const partnerEvidence =
    st >= partnerFloor && (hasPreferredProject(inputs, inst) || preferredContractCount(inputs, inst) >= 1);
  if (partnerEvidence) {
    tier = 'partner';
    reasons.push('partner project or contract evidence');
  }

  const branchTier = maxUnlockedTierOnBranches(unlocked, inst.supportedBranches);
  if (tier === 'partner' && branchTier >= thresholds.strategicMinBranchTier) {
    tier = 'strategic';
    reasons.push(`tier-${branchTier} branch unlock on supported path`);
  }

  if (
    tier === 'strategic' &&
    (branchTier >= 4 || st >= thresholds.nationalStanding)
  ) {
    tier = 'national_integration';
    reasons.push(branchTier >= 4 ? 'tier-4 branch integration' : 'exceptional standing');
  }

  const rank = INSTITUTION_UPGRADE_TIER_RANK[tier];
  return {
    institutionId: inst.id,
    tier,
    readinessMultiplier: rank === 0 ? 0 : 1 + rank * 0.1,
    diffusionMultiplier: rank === 0 ? 0 : 1 + rank * 0.14,
    assessedTurn: inputs.turn,
    reasons,
  };
}

export function computeInstitutionUpgrades(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): InstitutionUpgradeState[] {
  return RESEARCH_INSTITUTIONS.map(inst => evaluateInstitutionUpgrade(inputs, unlocked, inst)).sort((a, b) =>
    a.institutionId.localeCompare(b.institutionId)
  );
}

export function institutionUpgradesById(
  upgrades: InstitutionUpgradeState[]
): Record<string, InstitutionUpgradeState> {
  return Object.fromEntries(upgrades.map(u => [u.institutionId, u]));
}
