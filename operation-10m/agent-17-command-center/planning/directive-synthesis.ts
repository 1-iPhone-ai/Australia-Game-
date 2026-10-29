import type {
  Agent17ConvergenceIndexSnapshot,
  Agent17DirectiveSynthesisSnapshot,
  Agent17IntentQueueSnapshot,
  Agent17MissionDirectiveSnapshot,
} from '../types/command-center-types.ts';
import { convergenceIndexBlocksDirective } from './convergence-index.ts';

export interface Agent17DirectiveSynthesisInputs {
  missionDirective: Agent17MissionDirectiveSnapshot;
  convergenceIndex: Agent17ConvergenceIndexSnapshot;
  intentQueue: Agent17IntentQueueSnapshot;
}

export function buildAgent17DirectiveSynthesis(
  inputs: Agent17DirectiveSynthesisInputs
): Agent17DirectiveSynthesisSnapshot {
  const factors: Agent17DirectiveSynthesisSnapshot['factors'] = [];

  factors.push({
    id: 'directive_clearance',
    label: 'Mission directive clearance',
    score: inputs.missionDirective.clearanceScore,
    weight: 35,
  });

  factors.push({
    id: 'convergence',
    label: 'Ops convergence',
    score: inputs.convergenceIndex.convergenceIndex,
    weight: 30,
  });

  const intentCoverage =
    inputs.intentQueue.queueDepth >= 3
      ? 92
      : inputs.intentQueue.queueDepth >= 1
        ? 72
        : 40;
  factors.push({
    id: 'intent_coverage',
    label: 'Intent queue coverage',
    score: intentCoverage,
    weight: 20,
  });

  const laneOpenRatio = Math.round(
    (inputs.missionDirective.lanes.filter(l => l.clearance === 'open').length /
      Math.max(1, inputs.missionDirective.lanes.length)) *
      100
  );
  factors.push({
    id: 'lane_open_ratio',
    label: 'Open directive lanes',
    score: laneOpenRatio,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const synthesisIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const lockedSignals =
    inputs.missionDirective.band === 'held' ||
    inputs.convergenceIndex.band === 'diverging' ||
    convergenceIndexBlocksDirective(inputs.convergenceIndex);

  const band: Agent17DirectiveSynthesisSnapshot['band'] = lockedSignals
    ? 'locked'
    : synthesisIndex >= 62 &&
        (inputs.missionDirective.band === 'cleared' ||
          inputs.missionDirective.band === 'conditional')
      ? 'ready'
      : 'pending';

  return {
    synthesisIndex,
    band,
    factors,
    directiveBand: inputs.missionDirective.band,
    convergenceBand: inputs.convergenceIndex.band,
    headline: `Synthesis ${band} (${synthesisIndex}/100) · dir ${inputs.missionDirective.band}`,
  };
}

export function directiveSynthesisBlocksAdvance(
  snapshot: Agent17DirectiveSynthesisSnapshot
): boolean {
  return snapshot.band === 'locked' || snapshot.synthesisIndex < 36;
}
