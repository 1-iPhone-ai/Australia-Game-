import { RESEARCH_BRANCHES, RESEARCH_NODE_BY_ID } from './branches.ts';
import type {
  ResearchBranchId,
  ResearchProgressInputs,
  ResearchScaleWaveReport,
  UnlockedResearchNode,
} from './types.ts';

/** Pairs of branches that exchange technology transfer when both reach tier 3+. */
export const TECHNOLOGY_TRANSFER_PAIRS: Array<[ResearchBranchId, ResearchBranchId]> = [
  ['digital_frontier', 'industrial_transformation'],
  ['digital_frontier', 'sovereign_research'],
  ['resource_innovation', 'industrial_transformation'],
  ['energy_transition', 'agri_water_systems'],
  ['sovereign_research', 'industrial_transformation'],
  ['energy_transition', 'digital_frontier'],
];

function maxTierByBranch(unlocked: UnlockedResearchNode[]): Record<ResearchBranchId, number> {
  const tiers = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<ResearchBranchId, number>;
  for (const u of unlocked) {
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    tiers[u.branchId] = Math.max(tiers[u.branchId], tier);
  }
  return tiers;
}

export function computeTechnologyTransferLinks(
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport['technologyTransferLinks'] {
  const tiers = maxTierByBranch(unlocked);
  const links: ResearchScaleWaveReport['technologyTransferLinks'] = [];
  for (const [a, b] of TECHNOLOGY_TRANSFER_PAIRS) {
    const ta = tiers[a];
    const tb = tiers[b];
    if (ta >= 3 && tb >= 3) {
      const strength = Math.round(((ta + tb) / 10) * 100) / 100;
      links.push({ fromBranch: a, toBranch: b, strength });
    }
  }
  return links.sort((x, y) => y.strength - x.strength);
}

export function computeCrossBranchSynergyScore(unlocked: UnlockedResearchNode[]): number {
  const tiers = maxTierByBranch(unlocked);
  const values = Object.values(tiers).filter(t => t >= 3);
  if (values.length < 2) return 0;
  const avg = values.reduce((s, t) => s + t, 0) / values.length;
  const spread = Math.max(...values) - Math.min(...values);
  const tier5 = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  return Math.round(Math.min(100, avg * 12 + values.length * 4 + tier5 * 6 - spread * 2));
}

export function pickDominantCapabilityCluster(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport['dominantCapabilityCluster'] {
  const tiers = maxTierByBranch(unlocked);
  let bestBranch: ResearchBranchId | null = null;
  let best = 0;
  for (const b of RESEARCH_BRANCHES) {
    const score = tiers[b.id] * 10 + (inputs.capabilities[b.primaryCapability] ? 15 : 0);
    if (score > best) {
      best = score;
      bestBranch = b.id;
    }
  }
  if (!bestBranch) return null;
  return RESEARCH_BRANCHES.find(b => b.id === bestBranch)?.primaryCapability ?? null;
}

export function computeResearchScaleWaveReport(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport {
  const tier5UnlockCount = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  const crossBranchSynergyScore = computeCrossBranchSynergyScore(unlocked);
  const technologyTransferLinks = computeTechnologyTransferLinks(unlocked);
  return {
    active: tier5UnlockCount > 0 || crossBranchSynergyScore >= 40,
    tier5UnlockCount,
    crossBranchSynergyScore,
    technologyTransferLinks,
    dominantCapabilityCluster: pickDominantCapabilityCluster(inputs, unlocked),
  };
}

/** Applies bounded readiness uplift from synergy + transfer (does not bypass V10.5 caps). */
export function applyScaleWaveReadinessBonus(
  readinessByBranch: Record<ResearchBranchId, number>,
  report: ResearchScaleWaveReport
): Record<ResearchBranchId, number> {
  if (!report.active) return readinessByBranch;
  const bonus = Math.min(8, Math.floor(report.crossBranchSynergyScore / 12));
  const out = { ...readinessByBranch };
  for (const link of report.technologyTransferLinks) {
    out[link.fromBranch] = Math.min(100, (out[link.fromBranch] ?? 0) + Math.round(link.strength * 2));
    out[link.toBranch] = Math.min(100, (out[link.toBranch] ?? 0) + Math.round(link.strength * 2));
  }
  for (const b of RESEARCH_BRANCHES) {
    out[b.id] = Math.min(100, (out[b.id] ?? 0) + bonus);
  }
  return out;
}

/** Extra diffusion micro-boost when scale wave is active (still capped downstream). */
export function scaleWaveDiffusionBonus(report: ResearchScaleWaveReport | null): number {
  if (!report?.active) return 0;
  return Math.min(0.06, report.tier5UnlockCount * 0.008 + report.technologyTransferLinks.length * 0.003);
}
