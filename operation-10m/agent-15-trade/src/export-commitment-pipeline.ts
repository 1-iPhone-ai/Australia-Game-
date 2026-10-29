import type {
  GTELExportCapacitySnapshot,
  GTELPersisted,
  GTELPreferentialUtilizationSnapshot,
  GTELTradeCommitmentPipelineSnapshot,
  GTELTradeCorridorResilienceSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeCommitmentPipelineBand = GTELTradeCommitmentPipelineSnapshot['band'];

function pipelineBand(fillRate: number): GTELTradeCommitmentPipelineBand {
  if (fillRate >= 0.78) return 'booked_out';
  if (fillRate >= 0.58) return 'strong';
  if (fillRate >= 0.38) return 'steady';
  return 'slack';
}

export function sanitizeExportCommitmentPipelineSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.2, 0.9);
}

export function createEmptyTradeCommitmentPipelineSnapshot(): GTELTradeCommitmentPipelineSnapshot {
  return {
    fillRate: 0.52,
    band: 'steady',
    forwardBookTurns: 2,
    financeCoverage: 0.58,
    summary: 'Export commitment pipeline is filling at a steady pace.',
  };
}

export function advanceExportCommitmentPipelineSmoothing(
  persisted: GTELPersisted,
  rawFillRate: number,
): GTELPersisted {
  const prev = sanitizeExportCommitmentPipelineSmoothing(persisted.exportCommitmentPipelineSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawFillRate, 0.2, 0.9) * 0.27, 0.2, 0.9);
  return { ...persisted, exportCommitmentPipelineSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeCommitmentPipelineSnapshot(input: {
  exportCapacity: GTELExportCapacitySnapshot;
  preferentialUtilization: GTELPreferentialUtilizationSnapshot;
  tradeFinance: GTELTradeFinanceSnapshot;
  tradeCorridorResilience: GTELTradeCorridorResilienceSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeCommitmentPipelineSnapshot; persisted: GTELPersisted } {
  const capacityLift =
    input.exportCapacity.band === 'saturated'
      ? 0.22
      : input.exportCapacity.band === 'tight'
        ? 0.14
        : input.exportCapacity.band === 'balanced'
          ? 0.08
          : 0.03;
  const preferentialLift =
    input.preferentialUtilization.band === 'high' || input.preferentialUtilization.band === 'saturated'
      ? 0.12
      : input.preferentialUtilization.band === 'underused'
        ? -0.06
        : 0.04;
  const financeLift = gtelClamp((input.tradeFinance.availabilityScore - 0.5) * 0.18, -0.08, 0.1);
  const corridorLift = gtelClamp(input.tradeCorridorResilience.score * 0.12 - 0.04, -0.05, 0.1);
  const rawFillRate = gtelClamp(0.38 + capacityLift + preferentialLift + financeLift + corridorLift, 0.2, 0.9);
  const persisted = advanceExportCommitmentPipelineSmoothing(input.persisted, rawFillRate);
  const fillRate = sanitizeExportCommitmentPipelineSmoothing(persisted.exportCommitmentPipelineSmoothing);
  const band = pipelineBand(fillRate);
  const forwardBookTurns =
    band === 'booked_out' ? 3 : band === 'strong' ? 2 : band === 'steady' ? 2 : 1;
  const financeCoverage = gtelClamp(
    input.tradeFinance.availabilityScore * 0.45 + fillRate * 0.25 + input.exportCapacity.allocationEfficiency * 0.15,
    0.22,
    0.88,
  );

  const summary =
    band === 'booked_out'
      ? 'Forward export commitments are booked out — new spot cargoes face queue delays.'
      : band === 'slack'
        ? 'Commitment pipeline has slack; exporters can add spot volumes without queue risk.'
        : band === 'strong'
          ? 'Export forward book is strong with finance coverage on most scheduled lanes.'
          : 'Export commitment pipeline is filling at a steady pace.';

  return {
    snapshot: {
      fillRate: Math.round(fillRate * 1000) / 1000,
      band,
      forwardBookTurns,
      financeCoverage: Math.round(financeCoverage * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function exportCommitmentPipelineExportScale(snapshot: GTELTradeCommitmentPipelineSnapshot): number {
  if (snapshot.band === 'booked_out') return gtelClamp(0.92 + snapshot.financeCoverage * 0.06, 0.88, 0.96);
  if (snapshot.band === 'slack') return gtelClamp(1 + (0.62 - snapshot.fillRate) * 0.06, 1, 1.04);
  if (snapshot.band === 'strong') return gtelClamp(1 + snapshot.fillRate * 0.02, 0.99, 1.03);
  return gtelClamp(0.98 + snapshot.fillRate * 0.02, 0.96, 1.02);
}

export function exportCommitmentPipelineDomesticStress(snapshot: GTELTradeCommitmentPipelineSnapshot): number {
  if (snapshot.band === 'booked_out') return gtelClamp((snapshot.fillRate - 0.7) * 0.1, 0.02, 0.06);
  return 0;
}

export function exportCommitmentPipelineWorldEvent(
  snapshot: GTELTradeCommitmentPipelineSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'booked_out' && snapshot.band !== 'strong') return null;
  if (snapshot.fillRate < 0.58) return null;
  return {
    id: `gtel_commitment_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export commitment pipeline filling',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function exportCommitmentPipelineGiNotes(
  pipeline: GTELTradeCommitmentPipelineSnapshot | null | undefined,
): string[] {
  if (!pipeline) return [];
  return [
    `Export commitment pipeline: ${pipeline.band.replace(/_/g, ' ')} (${Math.round(pipeline.fillRate * 100)}% fill).`,
    pipeline.summary,
  ];
}
