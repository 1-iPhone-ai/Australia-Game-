import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24TimelineBranchNodeLike, Agent24TimelineRegistry } from './timeline-registry.ts';

export interface Agent24BranchLineageNode {
  nodeId: string;
  parentNodeId: string | null;
  branchTurn: number | null;
  depthFromRoot: number;
  lineagePath: string[];
  label: string;
  fingerprint: string;
}

export interface Agent24BranchLineageReport {
  reportId: string;
  matchId: string;
  nodeCount: number;
  maxDepth: number;
  deepestNodeId: string | null;
  nodes: Agent24BranchLineageNode[];
  deterministicFingerprint: string;
}

export interface Agent24BranchLineageInput {
  matchId: string;
  registry: Agent24TimelineRegistry;
  nodesById?: Record<string, Agent24TimelineBranchNodeLike>;
}

export function buildAgent24BranchLineageReport(input: Agent24BranchLineageInput): Agent24BranchLineageReport {
  const nodesById = input.nodesById || {};
  const nodeIds = new Set<string>(['root', ...input.registry.branchNodeOrder, ...Object.keys(nodesById)]);

  const meta = new Map<string, Agent24TimelineBranchNodeLike & { label: string }>();
  meta.set('root', { nodeId: 'root', label: 'Main timeline root', branchTurn: 1 });
  for (const nodeId of nodeIds) {
    if (nodeId === 'root') continue;
    const raw = nodesById[nodeId];
    const fromEntry = input.registry.entries.find(e => e.branchedAtNodeId === nodeId);
    meta.set(nodeId, {
      nodeId,
      parentNodeId: raw?.parentNodeId ?? 'root',
      branchTurn: raw?.branchTurn ?? fromEntry?.branchTurn ?? undefined,
      label: raw?.label || fromEntry?.label || nodeId,
    });
  }

  const lineageCache = new Map<string, string[]>();
  function lineagePath(nodeId: string): string[] {
    const cached = lineageCache.get(nodeId);
    if (cached) return cached;
    if (nodeId === 'root') {
      lineageCache.set(nodeId, ['root']);
      return ['root'];
    }
    const info = meta.get(nodeId);
    const parent = info?.parentNodeId && info.parentNodeId !== nodeId ? info.parentNodeId : 'root';
    const path = [...lineagePath(parent), nodeId];
    lineageCache.set(nodeId, path);
    return path;
  }

  const nodes: Agent24BranchLineageNode[] = [];
  for (const nodeId of [...nodeIds].sort()) {
    const info = meta.get(nodeId)!;
    const path = lineagePath(nodeId);
    const depthFromRoot = Math.max(0, path.length - 1);
    nodes.push({
      nodeId,
      parentNodeId: nodeId === 'root' ? null : info.parentNodeId ?? 'root',
      branchTurn: info.branchTurn ?? null,
      depthFromRoot,
      lineagePath: path,
      label: info.label,
      fingerprint: o6kAgent24Fingerprint('branch_lineage_node', { nodeId, depthFromRoot, path }),
    });
  }

  nodes.sort((a, b) => a.depthFromRoot - b.depthFromRoot || a.nodeId.localeCompare(b.nodeId));
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depthFromRoot), 0);
  const deepest = nodes.filter(n => n.depthFromRoot === maxDepth).sort((a, b) => a.nodeId.localeCompare(b.nodeId))[0];

  return {
    reportId: o6kAgent24Fingerprint('branch_lineage', { matchId: input.matchId, nodes: nodes.length }),
    matchId: input.matchId,
    nodeCount: nodes.length,
    maxDepth,
    deepestNodeId: deepest?.nodeId ?? null,
    nodes,
    deterministicFingerprint: o6kAgent24Fingerprint('branch_lineage_body', nodes.map(n => n.fingerprint)),
  };
}
