import type {
  GTELImportCommitmentPipelineSnapshot,
  GTELLogisticsStress,
  GTELPersisted,
  GTELTradeCommitmentPipelineSnapshot,
  GTELTradeFlowCohesionSnapshot,
  GTELTradeThroughputOrchestrationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeThroughputOrchestrationBand = GTELTradeThroughputOrchestrationSnapshot['band'];

function orchestrationBand(score: number): GTELTradeThroughputOrchestrationBand {
  if (score >= 0.72) return 'fluid';
  if (score >= 0.52) return 'paced';
  if (score >= 0.34) return 'congested';
  return 'stalled';
}

export function sanitizeTradeThroughputOrchestrationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyTradeThroughputOrchestrationSnapshot(): GTELTradeThroughputOrchestrationSnapshot {
  return {
    score: 0.52,
    band: 'paced',
    pipelineHeadroom: 0.18,
    logisticsSupport: 0.08,
    summary: 'Bilateral throughput is paced with modest headroom on commitment books.',
  };
}

export function advanceTradeThroughputOrchestrationSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeTradeThroughputOrchestrationSmoothing(persisted.tradeThroughputOrchestrationSmoothing);
  const next = gtelClamp(prev * 0.7 + gtelClamp(rawScore, 0.16, 0.92) * 0.3, 0.16, 0.92);
  return { ...persisted, tradeThroughputOrchestrationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeThroughputOrchestrationSnapshot(input: {
  exportCommitmentPipeline: GTELTradeCommitmentPipelineSnapshot;
  importCommitmentPipeline: GTELImportCommitmentPipelineSnapshot;
  tradeFlowCohesion: GTELTradeFlowCohesionSnapshot;
  logistics: GTELLogisticsStress;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeThroughputOrchestrationSnapshot; persisted: GTELPersisted } {
  const avgFill =
    (input.exportCommitmentPipeline.fillRate + input.importCommitmentPipeline.fillRate) / 2;
  const pipelineHeadroom = gtelClamp(1 - avgFill * 0.85, 0.08, 0.62);
  const cohesionLift =
    input.tradeFlowCohesion.band === 'synchronized'
      ? 0.18
      : input.tradeFlowCohesion.band === 'balanced'
        ? 0.1
        : input.tradeFlowCohesion.band === 'skewed'
          ? -0.04
          : -0.12;
  const logisticsSupport =
    input.logistics.band === 'fluid'
      ? 0.14
      : input.logistics.band === 'watch'
        ? 0.06
        : input.logistics.band === 'tight'
          ? -0.06
          : -0.14;
  const rawScore = gtelClamp(
    pipelineHeadroom * 0.42 + input.tradeFlowCohesion.score * 0.38 + 0.12 + cohesionLift + logisticsSupport,
    0.16,
    0.92,
  );
  const persisted = advanceTradeThroughputOrchestrationSmoothing(input.persisted, rawScore);
  const score = sanitizeTradeThroughputOrchestrationSmoothing(persisted.tradeThroughputOrchestrationSmoothing);
  const band = orchestrationBand(score);

  const summary =
    band === 'fluid'
      ? 'Throughput orchestration is fluid — planners can swing spot cargoes without queue risk.'
      : band === 'stalled'
        ? 'Bilateral throughput is stalled; commitment books and logistics are fighting for the same lanes.'
        : band === 'congested'
          ? 'Throughput orchestration is congested — forward books leave little slack for spot adjustments.'
          : 'Bilateral throughput is paced with modest headroom on commitment books.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      pipelineHeadroom: Math.round(pipelineHeadroom * 1000) / 1000,
      logisticsSupport: Math.round(logisticsSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeThroughputOrchestrationExportScale(
  snapshot: GTELTradeThroughputOrchestrationSnapshot,
): number {
  if (snapshot.band === 'fluid') return gtelClamp(1 + snapshot.score * 0.024, 1, 1.032);
  if (snapshot.band === 'stalled') return gtelClamp(0.86 + snapshot.score * 0.08, 0.84, 0.93);
  if (snapshot.band === 'congested') return gtelClamp(0.92 + snapshot.score * 0.06, 0.88, 0.98);
  return gtelClamp(0.97 + snapshot.score * 0.02, 0.94, 1.02);
}

export function tradeThroughputOrchestrationDomesticStress(
  snapshot: GTELTradeThroughputOrchestrationSnapshot,
): number {
  if (snapshot.band === 'stalled') return gtelClamp((0.4 - snapshot.score) * 0.12, 0.03, 0.08);
  if (snapshot.band === 'congested') return gtelClamp((0.55 - snapshot.score) * 0.08, 0.01, 0.05);
  return 0;
}

export function tradeThroughputOrchestrationWorldEvent(
  snapshot: GTELTradeThroughputOrchestrationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'stalled' && snapshot.band !== 'congested') return null;
  if (snapshot.score > 0.42) return null;
  return {
    id: `gtel_orchestration_${turn}`,
    turn,
    kind: 'trade',
    title: 'Throughput orchestration under strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'WA'],
  };
}

export function tradeThroughputOrchestrationGiNotes(
  snapshot: GTELTradeThroughputOrchestrationSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Trade throughput orchestration: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
