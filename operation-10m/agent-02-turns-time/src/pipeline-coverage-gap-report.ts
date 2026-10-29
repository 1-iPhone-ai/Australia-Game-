import { TurnTimeSnapshot } from './types.js';
import {
  computePipelineStageCoverage,
  type PipelineStageCoverageReport,
} from './pipeline-stage-coverage.js';
import type { Op10mAgent02PipelineStageId } from './pipeline-stages.js';

export interface PipelineCoverageGapReport {
  coverage: PipelineStageCoverageReport;
  observedCount: number;
  missingStageIds: Op10mAgent02PipelineStageId[];
  coverageRatio: number;
  ok: boolean;
}

/** Lists registered pipeline stages not yet seen in the snapshot trace (Agent 25 gap export). */
export function buildPipelineCoverageGapReport(snapshot: TurnTimeSnapshot): PipelineCoverageGapReport {
  const coverage = computePipelineStageCoverage(snapshot);
  const observedCount = coverage.observedStageIds.length;
  const coverageRatio =
    coverage.registeredStageCount === 0 ? 1 : observedCount / coverage.registeredStageCount;
  return {
    coverage,
    observedCount,
    missingStageIds: coverage.missingStageIds,
    coverageRatio,
    ok: coverage.missingStageIds.length === 0,
  };
}
