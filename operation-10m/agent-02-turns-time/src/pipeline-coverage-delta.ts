import { TurnTimeSnapshot } from './types.js';
import {
  computePipelineStageCoverage,
  type PipelineStageCoverageReport,
} from './pipeline-stage-coverage.js';
import type { Op10mAgent02PipelineStageId } from './pipeline-stages.js';

export interface PipelineStageCoverageDelta {
  before: PipelineStageCoverageReport;
  after: PipelineStageCoverageReport;
  newlyObservedStageIds: Op10mAgent02PipelineStageId[];
  hitCountDelta: Partial<Record<Op10mAgent02PipelineStageId, number>>;
}

export function computePipelineStageCoverageDelta(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
): PipelineStageCoverageDelta {
  const beforeReport = computePipelineStageCoverage(before);
  const afterReport = computePipelineStageCoverage(after);
  const beforeObserved = new Set(beforeReport.observedStageIds);
  const newlyObservedStageIds = afterReport.observedStageIds.filter((id) => !beforeObserved.has(id));

  const hitCountDelta: Partial<Record<Op10mAgent02PipelineStageId, number>> = {};
  for (const id of afterReport.observedStageIds) {
    const delta = (afterReport.hitCounts[id] ?? 0) - (beforeReport.hitCounts[id] ?? 0);
    if (delta !== 0) hitCountDelta[id] = delta;
  }

  return {
    before: beforeReport,
    after: afterReport,
    newlyObservedStageIds,
    hitCountDelta,
  };
}
