import type {
  Agent17CommandEnvelopeSnapshot,
  Agent17ConvergenceIndexSnapshot,
  Agent17IntentQueueSnapshot,
  Agent17MissionDirectiveSnapshot,
} from '../types/command-center-types.ts';
import { convergenceIndexBlocksDirective } from './convergence-index.ts';
import { commandEnvelopeNeedsThrottle } from './command-envelope.ts';

export interface Agent17MissionDirectiveInputs {
  intentQueue: Agent17IntentQueueSnapshot;
  commandEnvelope: Agent17CommandEnvelopeSnapshot;
  convergenceIndex: Agent17ConvergenceIndexSnapshot;
}

export function buildAgent17MissionDirective(
  inputs: Agent17MissionDirectiveInputs
): Agent17MissionDirectiveSnapshot {
  const lanes: Agent17MissionDirectiveSnapshot['lanes'] = [];

  const objectiveLane: Agent17MissionDirectiveSnapshot['lanes'][number] = {
    id: 'objective_lane',
    label: 'Tracked objective',
    priority: 90,
    clearance: inputs.intentQueue.queueDepth >= 1 ? 'open' : 'conditional',
    weight: 30,
  };
  lanes.push(objectiveLane);

  lanes.push({
    id: 'plan_execution',
    label: 'Active plan execution',
    priority: 80,
    clearance: inputs.commandEnvelope.automationAllowed ? 'open' : 'conditional',
    weight: 25,
  });

  lanes.push({
    id: 'delegation_expansion',
    label: 'Delegation expansion',
    priority: 65,
    clearance:
      inputs.commandEnvelope.capacityBand === 'nominal' &&
      inputs.commandEnvelope.activeDelegationCount < inputs.commandEnvelope.delegationCap
        ? 'open'
        : 'conditional',
    weight: 20,
  });

  lanes.push({
    id: 'recovery_reserve',
    label: 'Recovery reserve',
    priority: 55,
    clearance:
      inputs.convergenceIndex.band === 'diverging' ? 'closed' : 'conditional',
    weight: 15,
  });

  lanes.push({
    id: 'coordination_sync',
    label: 'GI coordination sync',
    priority: 70,
    clearance: inputs.intentQueue.primaryIntentId ? 'open' : 'conditional',
    weight: 10,
  });

  const weightedClearance = lanes.reduce((n, lane) => {
    const laneScore =
      lane.clearance === 'open' ? 100 : lane.clearance === 'conditional' ? 55 : 10;
    return n + laneScore * (lane.weight / 100);
  }, 0);
  const totalWeight = lanes.reduce((n, lane) => n + lane.weight, 0);
  const clearanceScore = Math.max(
    0,
    Math.min(100, Math.round((weightedClearance / Math.max(1, totalWeight)) * 100))
  );

  const heldSignals =
    convergenceIndexBlocksDirective(inputs.convergenceIndex) ||
    inputs.commandEnvelope.capacityBand === 'saturated' ||
    lanes.some(l => l.clearance === 'closed');

  const band: Agent17MissionDirectiveSnapshot['band'] = heldSignals
    ? 'held'
    : clearanceScore >= 70 && inputs.convergenceIndex.band === 'aligned'
      ? 'cleared'
      : 'conditional';

  const primaryLaneId =
    lanes.find(l => l.clearance === 'open')?.id ??
    lanes.sort((a, b) => b.priority - a.priority)[0]?.id ??
    null;

  const executionAllowed =
    band !== 'held' &&
    inputs.commandEnvelope.automationAllowed &&
    !convergenceIndexBlocksDirective(inputs.convergenceIndex) &&
    !commandEnvelopeNeedsThrottle(inputs.commandEnvelope);

  return {
    clearanceScore,
    band,
    lanes,
    primaryLaneId,
    executionAllowed,
    headline: `Directive ${band} (${clearanceScore}/100) · ${lanes.length} lanes`,
  };
}

export function missionDirectiveBlocksExecution(
  snapshot: Agent17MissionDirectiveSnapshot
): boolean {
  return snapshot.band === 'held' || !snapshot.executionAllowed;
}
