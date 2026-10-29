import { TurnTimeSnapshot } from './types.js';
import {
  derivePipelineStageHits,
  listRegisteredPipelineStageIds,
  type Op10mAgent02PipelineStageId,
} from './pipeline-stages.js';

export interface PipelineStageCoverageReport {
  registeredStageCount: number;
  observedStageIds: Op10mAgent02PipelineStageId[];
  missingStageIds: Op10mAgent02PipelineStageId[];
  hitCounts: Record<Op10mAgent02PipelineStageId, number>;
}

export function computePipelineStageCoverage(snapshot: TurnTimeSnapshot): PipelineStageCoverageReport {
  const registered = listRegisteredPipelineStageIds();
  const hitCounts = Object.fromEntries(
    registered.map((id) => [id, 0]),
  ) as Record<Op10mAgent02PipelineStageId, number>;

  for (const hit of derivePipelineStageHits(snapshot.trace)) {
    hitCounts[hit.stageId] = (hitCounts[hit.stageId] ?? 0) + 1;
  }

  const observedStageIds = registered.filter((id) => (hitCounts[id] ?? 0) > 0);
  const missingStageIds = registered.filter((id) => (hitCounts[id] ?? 0) === 0);

  return {
    registeredStageCount: registered.length,
    observedStageIds,
    missingStageIds,
    hitCounts,
  };
}
