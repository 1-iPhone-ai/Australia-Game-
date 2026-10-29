import type {
  GTELCommitmentTurnCloseoutSnapshot,
  GTELForwardSlotRolloverSnapshot,
  GTELImportCommitmentPipelineSnapshot,
  GTELPersisted,
  GTELTradeCommitmentPipelineSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELForwardSlotRolloverBand = GTELForwardSlotRolloverSnapshot['band'];

function rolloverBand(score: number): GTELForwardSlotRolloverBand {
  if (score >= 0.74) return 'seamless';
  if (score >= 0.55) return 'partial';
  if (score >= 0.37) return 'lumpy';
  return 'blocked';
}

export function sanitizeForwardSlotRolloverSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyForwardSlotRolloverSnapshot(): GTELForwardSlotRolloverSnapshot {
  return {
    score: 0.52,
    band: 'partial',
    openSlotCarry: 0.14,
    closeoutSupport: 0.08,
    summary: 'Forward slots are partially rolling into the next commitment window.',
  };
}

export function advanceForwardSlotRolloverSmoothing(persisted: GTELPersisted, rawScore: number): GTELPersisted {
  const prev = sanitizeForwardSlotRolloverSmoothing(persisted.forwardSlotRolloverSmoothing);
  const next = gtelClamp(prev * 0.66 + gtelClamp(rawScore, 0.16, 0.92) * 0.34, 0.16, 0.92);
  return { ...persisted, forwardSlotRolloverSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeForwardSlotRolloverSnapshot(input: {
  exportCommitmentPipeline: GTELTradeCommitmentPipelineSnapshot;
  importCommitmentPipeline: GTELImportCommitmentPipelineSnapshot;
  commitmentTurnCloseout: GTELCommitmentTurnCloseoutSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELForwardSlotRolloverSnapshot; persisted: GTELPersisted } {
  const openSlotCarry = gtelClamp(
    input.commitmentTurnCloseout.slotVariance * 0.65 +
      (input.commitmentTurnCloseout.band === 'open_slots' || input.commitmentTurnCloseout.band === 'unsettled'
        ? 0.18
        : 0.06),
    0.08,
    0.62,
  );
  const closeoutSupport =
    input.commitmentTurnCloseout.band === 'closed_clean'
      ? 0.16
      : input.commitmentTurnCloseout.band === 'minor_variance'
        ? 0.08
        : input.commitmentTurnCloseout.band === 'open_slots'
          ? -0.04
          : -0.11;
  const pipelineBalance = gtelClamp(
    1 - Math.abs(input.exportCommitmentPipeline.fillRate - input.importCommitmentPipeline.fillRate) * 0.9,
    0.14,
    0.86,
  );
  const rawScore = gtelClamp(
    pipelineBalance * 0.4 +
      input.commitmentTurnCloseout.score * 0.34 +
      (1 - openSlotCarry) * 0.18 +
      closeoutSupport,
    0.16,
    0.92,
  );
  const persisted = advanceForwardSlotRolloverSmoothing(input.persisted, rawScore);
  const score = sanitizeForwardSlotRolloverSmoothing(persisted.forwardSlotRolloverSmoothing);
  const band = rolloverBand(score);

  const summary =
    band === 'seamless'
      ? 'Forward slot rollover is seamless — open closeout slots carry cleanly into the next book.'
      : band === 'blocked'
        ? 'Slot rollover is blocked; unsettled closeout gaps are freezing the next commitment window.'
        : band === 'lumpy'
          ? 'Rollover is lumpy — planners are patching uneven carry from both commitment ledgers.'
          : 'Forward slots are partially rolling into the next commitment window.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      openSlotCarry: Math.round(openSlotCarry * 1000) / 1000,
      closeoutSupport: Math.round(closeoutSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function forwardSlotRolloverExportScale(snapshot: GTELForwardSlotRolloverSnapshot): number {
  if (snapshot.band === 'seamless') return gtelClamp(1 + snapshot.score * 0.019, 1, 1.025);
  if (snapshot.band === 'blocked') return gtelClamp(0.87 + snapshot.score * 0.06, 0.85, 0.94);
  if (snapshot.band === 'lumpy') return gtelClamp(0.93 + snapshot.score * 0.042, 0.9, 0.98);
  return gtelClamp(0.97 + snapshot.score * 0.014, 0.94, 1.02);
}

export function forwardSlotRolloverDomesticStress(snapshot: GTELForwardSlotRolloverSnapshot): number {
  if (snapshot.band === 'blocked') return gtelClamp((0.36 - snapshot.score) * 0.1, 0.02, 0.065);
  if (snapshot.band === 'lumpy') return gtelClamp((0.5 - snapshot.score) * 0.06, 0.008, 0.04);
  return 0;
}

export function forwardSlotRolloverWorldEvent(
  snapshot: GTELForwardSlotRolloverSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'lumpy') return null;
  if (snapshot.openSlotCarry < 0.2) return null;
  return {
    id: `gtel_slot_rollover_${turn}`,
    turn,
    kind: 'trade',
    title: 'Forward slot rollover strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'VIC'],
  };
}

export function forwardSlotRolloverGiNotes(snapshot: GTELForwardSlotRolloverSnapshot | null | undefined): string[] {
  if (!snapshot) return [];
  return [
    `Forward slot rollover: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
