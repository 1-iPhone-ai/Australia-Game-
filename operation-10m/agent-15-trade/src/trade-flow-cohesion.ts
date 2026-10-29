import type {
  GTELPersisted,
  GTELTradeBalanceStabilizationSnapshot,
  GTELTradeCommitmentPipelineSnapshot,
  GTELImportCommitmentPipelineSnapshot,
  GTELTradeFlowCohesionSnapshot,
  GTELTradeShockAbsorptionSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeFlowCohesionBand = GTELTradeFlowCohesionSnapshot['band'];

function cohesionBand(score: number): GTELTradeFlowCohesionBand {
  if (score >= 0.72) return 'synchronized';
  if (score >= 0.52) return 'balanced';
  if (score >= 0.34) return 'skewed';
  return 'dislocated';
}

export function sanitizeTradeFlowCohesionSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyTradeFlowCohesionSnapshot(): GTELTradeFlowCohesionSnapshot {
  return {
    score: 0.52,
    band: 'balanced',
    exportImportGap: 0.08,
    stabilizationSupport: 0.12,
    summary: 'Export and import commitment books are roughly aligned with balance stabilization.',
  };
}

export function advanceTradeFlowCohesionSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeTradeFlowCohesionSmoothing(persisted.tradeFlowCohesionSmoothing);
  const next = gtelClamp(prev * 0.71 + gtelClamp(rawScore, 0.16, 0.92) * 0.29, 0.16, 0.92);
  return { ...persisted, tradeFlowCohesionSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeFlowCohesionSnapshot(input: {
  exportCommitmentPipeline: GTELTradeCommitmentPipelineSnapshot;
  importCommitmentPipeline: GTELImportCommitmentPipelineSnapshot;
  tradeBalanceStabilization: GTELTradeBalanceStabilizationSnapshot;
  tradeShockAbsorption: GTELTradeShockAbsorptionSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeFlowCohesionSnapshot; persisted: GTELPersisted } {
  const exportImportGap = Math.abs(
    input.exportCommitmentPipeline.fillRate - input.importCommitmentPipeline.fillRate,
  );
  const pipelineAlignment = gtelClamp(1 - exportImportGap * 1.35, 0.12, 0.88);
  const stabilizationSupport =
    input.tradeBalanceStabilization.band === 'anchored'
      ? 0.16
      : input.tradeBalanceStabilization.band === 'steady'
        ? 0.1
        : input.tradeBalanceStabilization.band === 'volatile'
          ? 0.02
          : -0.06;
  const absorptionSupport =
    input.tradeShockAbsorption.band === 'deep'
      ? 0.12
      : input.tradeShockAbsorption.band === 'moderate'
        ? 0.06
        : input.tradeShockAbsorption.band === 'thin'
          ? -0.04
          : -0.1;
  const rawScore = gtelClamp(
    pipelineAlignment * 0.55 + 0.22 + stabilizationSupport + absorptionSupport,
    0.16,
    0.92,
  );
  const persisted = advanceTradeFlowCohesionSmoothing(input.persisted, rawScore);
  const score = sanitizeTradeFlowCohesionSmoothing(persisted.tradeFlowCohesionSmoothing);
  const band = cohesionBand(score);

  const summary =
    band === 'synchronized'
      ? 'Export and import forward books move in sync — throughput planners see stable bilateral flow.'
      : band === 'dislocated'
        ? 'Import and export commitment books are dislocated; balance stabilization is struggling to catch up.'
        : band === 'skewed'
          ? 'Trade flow cohesion is skewed — one side of the commitment ledger is running hot.'
          : 'Export and import commitment books are roughly aligned with balance stabilization.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      exportImportGap: Math.round(exportImportGap * 1000) / 1000,
      stabilizationSupport: Math.round(stabilizationSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeFlowCohesionDomesticStressRelief(snapshot: GTELTradeFlowCohesionSnapshot): number {
  if (snapshot.band === 'synchronized') return gtelClamp(snapshot.score * 0.04, 0.015, 0.035);
  if (snapshot.band === 'balanced') return gtelClamp(snapshot.score * 0.025, 0, 0.02);
  return 0;
}

export function tradeFlowCohesionExportScale(snapshot: GTELTradeFlowCohesionSnapshot): number {
  if (snapshot.band === 'synchronized') return gtelClamp(1 + snapshot.score * 0.022, 1, 1.03);
  if (snapshot.band === 'dislocated') return gtelClamp(0.88 + snapshot.score * 0.08, 0.86, 0.94);
  if (snapshot.band === 'skewed') return gtelClamp(0.93 + snapshot.score * 0.05, 0.9, 0.98);
  return gtelClamp(0.97 + snapshot.score * 0.02, 0.94, 1.02);
}

export function tradeFlowCohesionWorldEvent(
  snapshot: GTELTradeFlowCohesionSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'dislocated' && snapshot.band !== 'skewed') return null;
  if (snapshot.exportImportGap < 0.22) return null;
  return {
    id: `gtel_flow_cohesion_${turn}`,
    turn,
    kind: 'trade',
    title: 'Bilateral trade flow skew',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'VIC'],
  };
}

export function tradeFlowCohesionGiNotes(
  cohesion: GTELTradeFlowCohesionSnapshot | null | undefined,
): string[] {
  if (!cohesion) return [];
  return [
    `Trade flow cohesion: ${cohesion.band} (${Math.round(cohesion.score * 100)}% score).`,
    cohesion.summary,
  ];
}
