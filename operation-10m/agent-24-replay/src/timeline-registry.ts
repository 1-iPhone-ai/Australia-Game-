import { o6kAgent24Fingerprint } from './fingerprint.ts';

export type Agent24TimelineStatus = 'main' | 'branch' | 'simulated' | 'archived';

export interface Agent24TimelineBranchNodeLike {
  nodeId: string;
  parentNodeId?: string | null;
  branchTurn?: number;
  branchDay?: number;
  label?: string;
  triggerReason?: string;
  childNodeIds?: string[];
}

export interface Agent24TimelineRegistryInput {
  matchId: string;
  activeTimelineId?: string;
  activeNodeId?: string;
  nodesById?: Record<string, Agent24TimelineBranchNodeLike>;
  whatIfTimelines?: Array<{
    timelineId: string;
    title?: string;
    parentTimelineId?: string | null;
    status?: Agent24TimelineStatus;
    branchedAtNodeId?: string;
  }>;
}

export interface Agent24TimelineEntry {
  timelineId: string;
  status: Agent24TimelineStatus;
  parentTimelineId: string | null;
  branchedAtNodeId: string | null;
  branchTurn: number | null;
  label: string;
  fingerprint: string;
}

export interface Agent24TimelineRegistry {
  registryId: string;
  matchId: string;
  activeTimelineId: string;
  activeNodeId: string;
  entries: Agent24TimelineEntry[];
  branchNodeOrder: string[];
  deterministicFingerprint: string;
}

export function buildAgent24TimelineRegistry(input: Agent24TimelineRegistryInput): Agent24TimelineRegistry {
  const nodes = input.nodesById || {};
  const branchNodeOrder = Object.keys(nodes).sort((a, b) => {
    const ta = nodes[a]?.branchTurn ?? 0;
    const tb = nodes[b]?.branchTurn ?? 0;
    return ta - tb || a.localeCompare(b);
  });

  const entries: Agent24TimelineEntry[] = [];
  const mainId = input.activeTimelineId || 'main';
  entries.push({
    timelineId: mainId,
    status: 'main',
    parentTimelineId: null,
    branchedAtNodeId: input.activeNodeId || 'root',
    branchTurn: null,
    label: 'Main timeline',
    fingerprint: o6kAgent24Fingerprint('timeline_main', { matchId: input.matchId, mainId }),
  });

  for (const nodeId of branchNodeOrder) {
    const node = nodes[nodeId];
    if (!node) continue;
    entries.push({
      timelineId: `branch:${nodeId}`,
      status: 'branch',
      parentTimelineId: mainId,
      branchedAtNodeId: nodeId,
      branchTurn: node.branchTurn ?? null,
      label: node.label || nodeId,
      fingerprint: o6kAgent24Fingerprint('timeline_branch', {
        nodeId,
        parent: node.parentNodeId,
        turn: node.branchTurn,
        reason: node.triggerReason,
      }),
    });
  }

  for (const wt of input.whatIfTimelines || []) {
    entries.push({
      timelineId: wt.timelineId,
      status: (wt.status as Agent24TimelineStatus) || 'simulated',
      parentTimelineId: wt.parentTimelineId ?? mainId,
      branchedAtNodeId: wt.branchedAtNodeId ?? null,
      branchTurn: null,
      label: wt.title || wt.timelineId,
      fingerprint: o6kAgent24Fingerprint('timeline_whatif', wt),
    });
  }

  entries.sort((a, b) => a.timelineId.localeCompare(b.timelineId));
  const payload = entries.map(e => ({ id: e.timelineId, fp: e.fingerprint }));

  return {
    registryId: o6kAgent24Fingerprint('timeline_registry', { matchId: input.matchId, payload }),
    matchId: input.matchId,
    activeTimelineId: mainId,
    activeNodeId: input.activeNodeId || 'root',
    entries,
    branchNodeOrder,
    deterministicFingerprint: o6kAgent24Fingerprint('timeline_registry_body', payload),
  };
}
