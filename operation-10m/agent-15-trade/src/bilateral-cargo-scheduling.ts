import type {
  GTELBilateralCargoSchedulingSnapshot,
  GTELCommitmentLedgerHarmonizationSnapshot,
  GTELLogisticsStress,
  GTELPersisted,
  GTELTradeThroughputOrchestrationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCargoSchedulingBand = GTELBilateralCargoSchedulingSnapshot['band'];

function schedulingBand(score: number): GTELBilateralCargoSchedulingBand {
  if (score >= 0.73) return 'on_schedule';
  if (score >= 0.54) return 'slipping';
  if (score >= 0.36) return 'backlogged';
  return 'gridlocked';
}

export function sanitizeBilateralCargoSchedulingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCargoSchedulingSnapshot(): GTELBilateralCargoSchedulingSnapshot {
  return {
    score: 0.52,
    band: 'slipping',
    slotUtilization: 0.58,
    harmonizationSupport: 0.08,
    summary: 'Bilateral cargo slots are slipping slightly — planners are rebalancing queues.',
  };
}

export function advanceBilateralCargoSchedulingSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCargoSchedulingSmoothing(persisted.bilateralCargoSchedulingSmoothing);
  const next = gtelClamp(prev * 0.68 + gtelClamp(rawScore, 0.16, 0.92) * 0.32, 0.16, 0.92);
  return { ...persisted, bilateralCargoSchedulingSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralCargoSchedulingSnapshot(input: {
  commitmentLedgerHarmonization: GTELCommitmentLedgerHarmonizationSnapshot;
  tradeThroughputOrchestration: GTELTradeThroughputOrchestrationSnapshot;
  logistics: GTELLogisticsStress;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCargoSchedulingSnapshot; persisted: GTELPersisted } {
  const harmonizationSupport =
    input.commitmentLedgerHarmonization.band === 'aligned'
      ? 0.16
      : input.commitmentLedgerHarmonization.band === 'adjusting'
        ? 0.08
        : input.commitmentLedgerHarmonization.band === 'divergent'
          ? -0.06
          : -0.12;
  const orchestrationLift =
    input.tradeThroughputOrchestration.band === 'fluid'
      ? 0.14
      : input.tradeThroughputOrchestration.band === 'paced'
        ? 0.06
        : input.tradeThroughputOrchestration.band === 'congested'
          ? -0.05
          : -0.11;
  const slotUtilization = gtelClamp(
    input.tradeThroughputOrchestration.pipelineHeadroom * 0.55 +
      (1 - input.commitmentLedgerHarmonization.ledgerGap) * 0.35 +
      0.08,
    0.12,
    0.88,
  );
  const logisticsDrag =
    input.logistics.band === 'fluid'
      ? 0.1
      : input.logistics.band === 'watch'
        ? 0.02
        : input.logistics.band === 'tight'
          ? -0.08
          : -0.14;
  const rawScore = gtelClamp(
    slotUtilization * 0.44 +
      input.commitmentLedgerHarmonization.score * 0.28 +
      input.tradeThroughputOrchestration.score * 0.18 +
      harmonizationSupport +
      orchestrationLift +
      logisticsDrag,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCargoSchedulingSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCargoSchedulingSmoothing(persisted.bilateralCargoSchedulingSmoothing);
  const band = schedulingBand(score);

  const summary =
    band === 'on_schedule'
      ? 'Bilateral cargo scheduling is on schedule — slot books match harmonized commitment ledgers.'
      : band === 'gridlocked'
        ? 'Cargo scheduling is gridlocked; harmonized ledgers cannot find open berth windows.'
        : band === 'backlogged'
          ? 'Forward cargo slots are backlogged — throughput orchestration is lagging ledger alignment.'
          : 'Bilateral cargo slots are slipping slightly — planners are rebalancing queues.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      slotUtilization: Math.round(slotUtilization * 1000) / 1000,
      harmonizationSupport: Math.round(harmonizationSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCargoSchedulingExportScale(snapshot: GTELBilateralCargoSchedulingSnapshot): number {
  if (snapshot.band === 'on_schedule') return gtelClamp(1 + snapshot.score * 0.021, 1, 1.028);
  if (snapshot.band === 'gridlocked') return gtelClamp(0.86 + snapshot.score * 0.07, 0.84, 0.93);
  if (snapshot.band === 'backlogged') return gtelClamp(0.92 + snapshot.score * 0.05, 0.89, 0.97);
  return gtelClamp(0.97 + snapshot.score * 0.016, 0.94, 1.02);
}

export function bilateralCargoSchedulingDomesticStress(snapshot: GTELBilateralCargoSchedulingSnapshot): number {
  if (snapshot.band === 'gridlocked') return gtelClamp((0.38 - snapshot.score) * 0.11, 0.025, 0.07);
  if (snapshot.band === 'backlogged') return gtelClamp((0.52 - snapshot.score) * 0.07, 0.01, 0.045);
  return 0;
}

export function bilateralCargoSchedulingWorldEvent(
  snapshot: GTELBilateralCargoSchedulingSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'gridlocked' && snapshot.band !== 'backlogged') return null;
  if (snapshot.slotUtilization > 0.42) return null;
  return {
    id: `gtel_cargo_sched_${turn}`,
    turn,
    kind: 'trade',
    title: 'Bilateral cargo scheduling strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'VIC', 'NSW'],
  };
}

export function bilateralCargoSchedulingGiNotes(
  snapshot: GTELBilateralCargoSchedulingSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral cargo scheduling: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
