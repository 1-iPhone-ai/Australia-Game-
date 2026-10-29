import type {
  GTELCommitmentLedgerHarmonizationSnapshot,
  GTELImportCommitmentPipelineSnapshot,
  GTELPersisted,
  GTELTradeCommitmentPipelineSnapshot,
  GTELTradeFlowCohesionSnapshot,
  GTELTradeThroughputOrchestrationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCommitmentLedgerHarmonizationBand = GTELCommitmentLedgerHarmonizationSnapshot['band'];

function harmonizationBand(score: number): GTELCommitmentLedgerHarmonizationBand {
  if (score >= 0.74) return 'aligned';
  if (score >= 0.54) return 'adjusting';
  if (score >= 0.36) return 'divergent';
  return 'fractured';
}

export function sanitizeCommitmentLedgerHarmonizationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCommitmentLedgerHarmonizationSnapshot(): GTELCommitmentLedgerHarmonizationSnapshot {
  return {
    score: 0.52,
    band: 'adjusting',
    ledgerGap: 0.1,
    orchestrationSupport: 0.08,
    summary: 'Forward commitment ledgers are adjusting toward bilateral balance.',
  };
}

export function advanceCommitmentLedgerHarmonizationSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCommitmentLedgerHarmonizationSmoothing(persisted.commitmentLedgerHarmonizationSmoothing);
  const next = gtelClamp(prev * 0.69 + gtelClamp(rawScore, 0.16, 0.92) * 0.31, 0.16, 0.92);
  return { ...persisted, commitmentLedgerHarmonizationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCommitmentLedgerHarmonizationSnapshot(input: {
  exportCommitmentPipeline: GTELTradeCommitmentPipelineSnapshot;
  importCommitmentPipeline: GTELImportCommitmentPipelineSnapshot;
  tradeFlowCohesion: GTELTradeFlowCohesionSnapshot;
  tradeThroughputOrchestration: GTELTradeThroughputOrchestrationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCommitmentLedgerHarmonizationSnapshot; persisted: GTELPersisted } {
  const ledgerGap = Math.abs(
    input.exportCommitmentPipeline.financeCoverage - input.importCommitmentPipeline.financeCoverage,
  );
  const coverageAlignment = gtelClamp(1 - ledgerGap * 1.25, 0.12, 0.88);
  const orchestrationSupport =
    input.tradeThroughputOrchestration.band === 'fluid'
      ? 0.14
      : input.tradeThroughputOrchestration.band === 'paced'
        ? 0.08
        : input.tradeThroughputOrchestration.band === 'congested'
          ? -0.04
          : -0.1;
  const cohesionSupport =
    input.tradeFlowCohesion.band === 'synchronized'
      ? 0.12
      : input.tradeFlowCohesion.band === 'dislocated'
        ? -0.1
        : 0.04;
  const rawScore = gtelClamp(
    coverageAlignment * 0.48 + input.tradeFlowCohesion.score * 0.28 + orchestrationSupport + cohesionSupport,
    0.16,
    0.92,
  );
  const persisted = advanceCommitmentLedgerHarmonizationSmoothing(input.persisted, rawScore);
  const score = sanitizeCommitmentLedgerHarmonizationSmoothing(persisted.commitmentLedgerHarmonizationSmoothing);
  const band = harmonizationBand(score);

  const summary =
    band === 'aligned'
      ? 'Export and import commitment ledgers are harmonized — finance coverage matches on both sides.'
      : band === 'fractured'
        ? 'Commitment ledgers are fractured; finance coverage gaps are blocking bilateral scheduling.'
        : band === 'divergent'
          ? 'Forward books are divergent — one ledger is running ahead of finance coverage.'
          : 'Forward commitment ledgers are adjusting toward bilateral balance.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      ledgerGap: Math.round(ledgerGap * 1000) / 1000,
      orchestrationSupport: Math.round(orchestrationSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function commitmentLedgerHarmonizationExportScale(
  snapshot: GTELCommitmentLedgerHarmonizationSnapshot,
): number {
  if (snapshot.band === 'aligned') return gtelClamp(1 + snapshot.score * 0.022, 1, 1.03);
  if (snapshot.band === 'fractured') return gtelClamp(0.87 + snapshot.score * 0.07, 0.85, 0.94);
  if (snapshot.band === 'divergent') return gtelClamp(0.93 + snapshot.score * 0.05, 0.9, 0.98);
  return gtelClamp(0.97 + snapshot.score * 0.018, 0.94, 1.02);
}

export function commitmentLedgerHarmonizationDomesticStressRelief(
  snapshot: GTELCommitmentLedgerHarmonizationSnapshot,
): number {
  if (snapshot.band === 'aligned') return gtelClamp(snapshot.score * 0.035, 0.015, 0.04);
  if (snapshot.band === 'adjusting') return gtelClamp(snapshot.score * 0.02, 0, 0.022);
  return 0;
}

export function commitmentLedgerHarmonizationWorldEvent(
  snapshot: GTELCommitmentLedgerHarmonizationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'fractured' && snapshot.band !== 'divergent') return null;
  if (snapshot.ledgerGap < 0.18) return null;
  return {
    id: `gtel_ledger_harm_${turn}`,
    turn,
    kind: 'trade',
    title: 'Commitment ledger misalignment',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'SA'],
  };
}

export function commitmentLedgerHarmonizationGiNotes(
  snapshot: GTELCommitmentLedgerHarmonizationSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Commitment ledger harmonization: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
