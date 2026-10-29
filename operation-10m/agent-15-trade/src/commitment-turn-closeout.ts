import type {
  GTELBilateralCargoSchedulingSnapshot,
  GTELCommitmentLedgerHarmonizationSnapshot,
  GTELCommitmentTurnCloseoutSnapshot,
  GTELImportCommitmentPipelineSnapshot,
  GTELPersisted,
  GTELTradeCommitmentPipelineSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCommitmentTurnCloseoutBand = GTELCommitmentTurnCloseoutSnapshot['band'];

function closeoutBand(score: number): GTELCommitmentTurnCloseoutBand {
  if (score >= 0.75) return 'closed_clean';
  if (score >= 0.55) return 'minor_variance';
  if (score >= 0.37) return 'open_slots';
  return 'unsettled';
}

export function sanitizeCommitmentTurnCloseoutSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCommitmentTurnCloseoutSnapshot(): GTELCommitmentTurnCloseoutSnapshot {
  return {
    score: 0.52,
    band: 'minor_variance',
    slotVariance: 0.12,
    schedulingSupport: 0.08,
    summary: 'Turn closeout shows minor variance between booked and realized commitment slots.',
  };
}

export function advanceCommitmentTurnCloseoutSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCommitmentTurnCloseoutSmoothing(persisted.commitmentTurnCloseoutSmoothing);
  const next = gtelClamp(prev * 0.67 + gtelClamp(rawScore, 0.16, 0.92) * 0.33, 0.16, 0.92);
  return { ...persisted, commitmentTurnCloseoutSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCommitmentTurnCloseoutSnapshot(input: {
  exportCommitmentPipeline: GTELTradeCommitmentPipelineSnapshot;
  importCommitmentPipeline: GTELImportCommitmentPipelineSnapshot;
  commitmentLedgerHarmonization: GTELCommitmentLedgerHarmonizationSnapshot;
  bilateralCargoScheduling: GTELBilateralCargoSchedulingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCommitmentTurnCloseoutSnapshot; persisted: GTELPersisted } {
  const slotVariance = Math.abs(input.exportCommitmentPipeline.fillRate - input.importCommitmentPipeline.fillRate);
  const variancePenalty = gtelClamp(1 - slotVariance * 1.1, 0.14, 0.86);
  const schedulingSupport =
    input.bilateralCargoScheduling.band === 'on_schedule'
      ? 0.15
      : input.bilateralCargoScheduling.band === 'slipping'
        ? 0.06
        : input.bilateralCargoScheduling.band === 'backlogged'
          ? -0.05
          : -0.11;
  const harmonizationLift =
    input.commitmentLedgerHarmonization.band === 'aligned'
      ? 0.12
      : input.commitmentLedgerHarmonization.band === 'fractured'
        ? -0.1
        : 0.04;
  const rawScore = gtelClamp(
    variancePenalty * 0.46 +
      input.bilateralCargoScheduling.score * 0.32 +
      input.commitmentLedgerHarmonization.score * 0.14 +
      schedulingSupport +
      harmonizationLift,
    0.16,
    0.92,
  );
  const persisted = advanceCommitmentTurnCloseoutSmoothing(input.persisted, rawScore);
  const score = sanitizeCommitmentTurnCloseoutSmoothing(persisted.commitmentTurnCloseoutSmoothing);
  const band = closeoutBand(score);

  const summary =
    band === 'closed_clean'
      ? 'Commitment turn closeout is clean — forward slots reconcile with realized cargo scheduling.'
      : band === 'unsettled'
        ? 'Turn closeout is unsettled; open slots remain on one or both commitment ledgers.'
        : band === 'open_slots'
          ? 'Closeout left open slots — planners must roll commitments into the next turn window.'
          : 'Turn closeout shows minor variance between booked and realized commitment slots.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      slotVariance: Math.round(slotVariance * 1000) / 1000,
      schedulingSupport: Math.round(schedulingSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function commitmentTurnCloseoutExportScale(snapshot: GTELCommitmentTurnCloseoutSnapshot): number {
  if (snapshot.band === 'closed_clean') return gtelClamp(1 + snapshot.score * 0.02, 1, 1.026);
  if (snapshot.band === 'unsettled') return gtelClamp(0.87 + snapshot.score * 0.06, 0.85, 0.94);
  if (snapshot.band === 'open_slots') return gtelClamp(0.93 + snapshot.score * 0.045, 0.9, 0.98);
  return gtelClamp(0.97 + snapshot.score * 0.015, 0.94, 1.02);
}

export function commitmentTurnCloseoutDomesticStressRelief(snapshot: GTELCommitmentTurnCloseoutSnapshot): number {
  if (snapshot.band === 'closed_clean') return gtelClamp(snapshot.score * 0.032, 0.012, 0.038);
  if (snapshot.band === 'minor_variance') return gtelClamp(snapshot.score * 0.018, 0, 0.02);
  return 0;
}

export function commitmentTurnCloseoutWorldEvent(
  snapshot: GTELCommitmentTurnCloseoutSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'unsettled' && snapshot.band !== 'open_slots') return null;
  if (snapshot.slotVariance < 0.22) return null;
  return {
    id: `gtel_closeout_${turn}`,
    turn,
    kind: 'trade',
    title: 'Commitment turn closeout gap',
    summary: snapshot.summary,
    regionIds: ['QLD', 'NSW', 'SA'],
  };
}

export function commitmentTurnCloseoutGiNotes(
  snapshot: GTELCommitmentTurnCloseoutSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Commitment turn closeout: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
