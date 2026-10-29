import { AGENT03_ACTIVE_PROJECT } from './internal-constants.ts';
import { RESEARCH_NODE_BY_ID } from './branches.ts';
import type { ResearchExternalPrerequisite, ResearchProgressInputs } from './types.ts';
import { V94_CAPABILITY_MATURITY_RANK } from './v94-ids.ts';

export interface PrerequisiteEvaluation {
  nodeId: string;
  satisfied: boolean;
  missingNodeIds: string[];
  unmetExternal: ResearchExternalPrerequisite[];
  detail: string[];
}

function countContracts(inputs: ResearchProgressInputs, contractType: string): number {
  return inputs.completedContracts.filter(c => c.contractType === contractType).length;
}

function projectActive(
  inputs: ResearchProgressInputs,
  projectType: string,
  regionId?: string
): boolean {
  return inputs.projects.some(
    p =>
      p.projectType === projectType &&
      AGENT03_ACTIVE_PROJECT.test(p.status) &&
      (regionId == null || p.regionId === regionId)
  );
}

function capabilityAtLeast(
  inputs: ResearchProgressInputs,
  capability: string,
  minMaturity: keyof typeof V94_CAPABILITY_MATURITY_RANK
): boolean {
  const cap = inputs.capabilities[capability as keyof typeof inputs.capabilities];
  if (!cap) return false;
  return V94_CAPABILITY_MATURITY_RANK[cap.maturity] >= V94_CAPABILITY_MATURITY_RANK[minMaturity];
}

function megaprojectStages(inputs: ResearchProgressInputs, program: string): number {
  return inputs.megaprojects[program as keyof typeof inputs.megaprojects]?.completedStages ?? 0;
}

function factionStanding(inputs: ResearchProgressInputs, factionId: string): number {
  return inputs.factionStanding[factionId as keyof typeof inputs.factionStanding] ?? 0;
}

function sectorScore(inputs: ResearchProgressInputs, regionId: string, sector: string): number {
  const region = inputs.regions.find(r => r.code === regionId);
  if (!region) return 0;
  return Number(region.sectors[sector as keyof typeof region.sectors] ?? 0);
}

export function evaluateExternalPrerequisite(
  inputs: ResearchProgressInputs,
  req: ResearchExternalPrerequisite
): boolean {
  switch (req.kind) {
    case 'capability':
      return capabilityAtLeast(inputs, req.capability, req.minMaturity);
    case 'project_active':
      return projectActive(inputs, req.projectType, req.regionId);
    case 'contract_completed':
      return countContracts(inputs, req.contractType) >= (req.minCount ?? 1);
    case 'megaproject_stage':
      return megaprojectStages(inputs, req.program) >= req.minCompletedStages;
    case 'faction_standing':
      return factionStanding(inputs, req.factionId) >= req.minStanding;
    case 'sector_strength':
      return sectorScore(inputs, req.regionId, req.sector) >= req.minScore;
    default:
      return false;
  }
}

export function evaluateNodePrerequisites(
  inputs: ResearchProgressInputs,
  nodeId: string,
  unlockedNodeIds: Set<string>
): PrerequisiteEvaluation {
  const def = RESEARCH_NODE_BY_ID[nodeId];
  if (!def) {
    return {
      nodeId,
      satisfied: false,
      missingNodeIds: [],
      unmetExternal: [],
      detail: ['unknown node'],
    };
  }

  const missingNodeIds = def.requiresNodes.filter(id => !unlockedNodeIds.has(id));
  const unmetExternal = def.external.filter(ext => !evaluateExternalPrerequisite(inputs, ext));
  const satisfied = missingNodeIds.length === 0 && unmetExternal.length === 0;

  const detail: string[] = [];
  missingNodeIds.forEach(id => detail.push(`requires node ${id}`));
  unmetExternal.forEach(ext => detail.push(`external:${ext.kind}`));

  return { nodeId, satisfied, missingNodeIds, unmetExternal, detail };
}

/** Topological order for branch nodes (respects requiresNodes only). */
export function branchNodeTopologicalOrder(branchId: string): string[] {
  const nodes = Object.values(RESEARCH_NODE_BY_ID).filter(n => n.branchId === branchId);
  const ids = new Set(nodes.map(n => n.id));
  const order: string[] = [];
  const visited = new Set<string>();

  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    const def = RESEARCH_NODE_BY_ID[id];
    if (!def) return;
    def.requiresNodes.filter(r => ids.has(r)).forEach(visit);
    order.push(id);
  };

  nodes.sort((a, b) => a.tier - b.tier).forEach(n => visit(n.id));
  return order;
}

export function detectPrerequisiteCycle(): string | null {
  const visiting = new Set<string>();
  const done = new Set<string>();

  const dfs = (id: string): string | null => {
    if (done.has(id)) return null;
    if (visiting.has(id)) return id;
    visiting.add(id);
    const def = RESEARCH_NODE_BY_ID[id];
    if (def) {
      for (const pre of def.requiresNodes) {
        const cycle = dfs(pre);
        if (cycle) return cycle;
      }
    }
    visiting.delete(id);
    done.add(id);
    return null;
  };

  for (const id of Object.keys(RESEARCH_NODE_BY_ID)) {
    const c = dfs(id);
    if (c) return `cycle at ${c}`;
  }
  return null;
}
