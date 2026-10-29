import type {
  GTELBilateralPreparedArcOpeningHandoffSnapshot,
  GTELNextArcOpenPrepContinuitySnapshot,
  GTELPersisted,
  GTELPreparedArcHandoffContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELPreparedArcHandoffContinuityBand = GTELPreparedArcHandoffContinuitySnapshot['band'];

function continuityBand(score: number): GTELPreparedArcHandoffContinuityBand {
  if (score >= 0.93) return 'locked';
  if (score >= 0.73) return 'tracking';
  if (score >= 0.55) return 'slack';
  return 'broken';
}

export function sanitizePreparedArcHandoffContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyPreparedArcHandoffContinuitySnapshot(): GTELPreparedArcHandoffContinuitySnapshot {
  return {
    score: 0.52,
    band: 'tracking',
    handoffSupport: 0.1,
    prepAnchor: 0.08,
    summary: 'Prepared arc handoff continuity is tracking handed-off prep against ready continuity.',
  };
}

export function advancePreparedArcHandoffContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizePreparedArcHandoffContinuitySmoothing(persisted.preparedArcHandoffContinuitySmoothing);
  const next = gtelClamp(prev * 0.3 + gtelClamp(rawScore, 0.16, 0.92) * 0.7, 0.16, 0.92);
  return { ...persisted, preparedArcHandoffContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computePreparedArcHandoffContinuitySnapshot(input: {
  bilateralPreparedArcOpeningHandoff: GTELBilateralPreparedArcOpeningHandoffSnapshot;
  nextArcOpenPrepContinuity: GTELNextArcOpenPrepContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELPreparedArcHandoffContinuitySnapshot; persisted: GTELPersisted } {
  const handoffSupport =
    input.bilateralPreparedArcOpeningHandoff.band === 'handed_off'
      ? 0.18
      : input.bilateralPreparedArcOpeningHandoff.band === 'coupling'
        ? 0.08
        : input.bilateralPreparedArcOpeningHandoff.band === 'queued'
          ? -0.04
          : -0.11;
  const prepAnchor =
    input.nextArcOpenPrepContinuity.band === 'ready'
      ? 0.15
      : input.nextArcOpenPrepContinuity.band === 'cleared'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralPreparedArcOpeningHandoff.score * 0.51 +
      input.nextArcOpenPrepContinuity.score * 0.25 +
      handoffSupport +
      prepAnchor,
    0.16,
    0.92,
  );
  const persisted = advancePreparedArcHandoffContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizePreparedArcHandoffContinuitySmoothing(persisted.preparedArcHandoffContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'locked'
      ? 'Prepared arc handoff continuity is locked — handed-off prep and ready continuity stay coupled.'
      : band === 'broken'
        ? 'Handoff continuity broken; withheld prep and cleared continuity diverged.'
        : band === 'slack'
          ? 'Handoff continuity slack — prep anchor is lagging arc handoff.'
          : 'Prepared arc handoff continuity is tracking handed-off prep against ready continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffSupport: Math.round(handoffSupport * 1000) / 1000,
      prepAnchor: Math.round(prepAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function preparedArcHandoffContinuityExportScale(snapshot: GTELPreparedArcHandoffContinuitySnapshot): number {
  if (snapshot.band === 'locked') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'broken') return gtelClamp(0.954 + snapshot.score * 0.005, 0.948, 0.966);
  if (snapshot.band === 'slack') return gtelClamp(0.989 + snapshot.score * 0.001, 0.984, 0.992);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function preparedArcHandoffContinuityDomesticStress(snapshot: GTELPreparedArcHandoffContinuitySnapshot): number {
  if (snapshot.band === 'broken') return gtelClamp((0.23 - snapshot.score) * 0.026, 0.003, 0.012);
  if (snapshot.band === 'slack') return gtelClamp((0.35 - snapshot.score) * 0.01, 0.001, 0.004);
  return 0;
}

export function preparedArcHandoffContinuityWorldEvent(
  snapshot: GTELPreparedArcHandoffContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'slack') return null;
  if (snapshot.handoffSupport > -0.02) return null;
  return {
    id: `gtel_handoff_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Prepared arc handoff continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'WA'],
  };
}

export function preparedArcHandoffContinuityGiNotes(
  snapshot: GTELPreparedArcHandoffContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Prepared arc handoff continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
