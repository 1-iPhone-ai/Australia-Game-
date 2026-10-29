import type {
  GTELImportDependencySnapshot,
  GTELImportLanePressureSnapshot,
  GTELPersisted,
  GTELImportCommitmentPipelineSnapshot,
  GTELSupplyChainResilienceSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELImportCommitmentPipelineBand = GTELImportCommitmentPipelineSnapshot['band'];

function importPipelineBand(fillRate: number): GTELImportCommitmentPipelineBand {
  if (fillRate >= 0.76) return 'booked_out';
  if (fillRate >= 0.56) return 'strong';
  if (fillRate >= 0.36) return 'steady';
  return 'slack';
}

export function sanitizeImportCommitmentPipelineSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.5), 0.18, 0.9);
}

export function createEmptyImportCommitmentPipelineSnapshot(): GTELImportCommitmentPipelineSnapshot {
  return {
    fillRate: 0.5,
    band: 'steady',
    forwardBookTurns: 2,
    financeCoverage: 0.54,
    summary: 'Import commitment pipeline is filling at a steady pace.',
  };
}

export function advanceImportCommitmentPipelineSmoothing(
  persisted: GTELPersisted,
  rawFillRate: number,
): GTELPersisted {
  const prev = sanitizeImportCommitmentPipelineSmoothing(persisted.importCommitmentPipelineSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawFillRate, 0.18, 0.9) * 0.28, 0.18, 0.9);
  return { ...persisted, importCommitmentPipelineSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeImportCommitmentPipelineSnapshot(input: {
  importDependency: GTELImportDependencySnapshot;
  importLanePressure: GTELImportLanePressureSnapshot;
  tradeFinance: GTELTradeFinanceSnapshot;
  supplyChainResilience: GTELSupplyChainResilienceSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELImportCommitmentPipelineSnapshot; persisted: GTELPersisted } {
  const dependencyLift =
    input.importDependency.band === 'critical'
      ? 0.2
      : input.importDependency.band === 'elevated'
        ? 0.14
        : input.importDependency.band === 'moderate'
          ? 0.08
          : 0.03;
  const laneLift =
    input.importLanePressure.band === 'gridlocked' || input.importLanePressure.band === 'congested'
      ? 0.16
      : input.importLanePressure.band === 'busy'
        ? 0.08
        : 0.02;
  const financeLift = gtelClamp((input.tradeFinance.availabilityScore - 0.5) * 0.16, -0.08, 0.1);
  const resilienceLift = gtelClamp(input.supplyChainResilience.score * 0.1 - 0.04, -0.06, 0.08);
  const rawFillRate = gtelClamp(0.36 + dependencyLift + laneLift + financeLift + resilienceLift, 0.18, 0.9);
  const persisted = advanceImportCommitmentPipelineSmoothing(input.persisted, rawFillRate);
  const fillRate = sanitizeImportCommitmentPipelineSmoothing(persisted.importCommitmentPipelineSmoothing);
  const band = importPipelineBand(fillRate);
  const forwardBookTurns =
    band === 'booked_out' ? 3 : band === 'strong' ? 2 : band === 'steady' ? 2 : 1;
  const financeCoverage = gtelClamp(
    input.tradeFinance.availabilityScore * 0.42 + fillRate * 0.22 + input.supplyChainResilience.redundancyIndex * 0.12,
    0.2,
    0.86,
  );

  const summary =
    band === 'booked_out'
      ? 'Forward import commitments are booked out — clearance slots are rationed on key lanes.'
      : band === 'slack'
        ? 'Import commitment pipeline has slack; buyers can add spot cargoes without queue risk.'
        : band === 'strong'
          ? 'Import forward book is strong with finance coverage on most scheduled arrivals.'
          : 'Import commitment pipeline is filling at a steady pace.';

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

export function importCommitmentPipelineExportScale(snapshot: GTELImportCommitmentPipelineSnapshot): number {
  if (snapshot.band === 'booked_out') return gtelClamp(0.91 + snapshot.financeCoverage * 0.05, 0.87, 0.95);
  if (snapshot.band === 'slack') return gtelClamp(1 + (0.58 - snapshot.fillRate) * 0.05, 1, 1.03);
  if (snapshot.band === 'strong') return gtelClamp(0.99 + snapshot.fillRate * 0.015, 0.98, 1.02);
  return gtelClamp(0.98 + snapshot.fillRate * 0.018, 0.96, 1.02);
}

export function importCommitmentPipelineDomesticStress(snapshot: GTELImportCommitmentPipelineSnapshot): number {
  if (snapshot.band === 'booked_out') return gtelClamp((snapshot.fillRate - 0.68) * 0.12, 0.02, 0.07);
  return 0;
}

export function importCommitmentPipelineWorldEvent(
  snapshot: GTELImportCommitmentPipelineSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'booked_out' && snapshot.band !== 'strong') return null;
  if (snapshot.fillRate < 0.56) return null;
  return {
    id: `gtel_import_commit_${turn}`,
    turn,
    kind: 'domestic',
    title: 'Import commitment pipeline filling',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'SA'],
  };
}

export function importCommitmentPipelineGiNotes(
  pipeline: GTELImportCommitmentPipelineSnapshot | null | undefined,
): string[] {
  if (!pipeline) return [];
  return [
    `Import commitment pipeline: ${pipeline.band.replace(/_/g, ' ')} (${Math.round(pipeline.fillRate * 100)}% fill).`,
    pipeline.summary,
  ];
}
