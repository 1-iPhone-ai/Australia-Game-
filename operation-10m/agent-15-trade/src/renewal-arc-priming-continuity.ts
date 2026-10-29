import type {
  GTELBilateralRenewalArcPrimingGateSnapshot,
  GTELForwardArcRechargeContinuitySnapshot,
  GTELPersisted,
  GTELRenewalArcPrimingContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELRenewalArcPrimingContinuityBand = GTELRenewalArcPrimingContinuitySnapshot['band'];

function continuityBand(score: number): GTELRenewalArcPrimingContinuityBand {
  if (score >= 0.93) return 'settled';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'unsettled';
  return 'void';
}

export function sanitizeRenewalArcPrimingContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyRenewalArcPrimingContinuitySnapshot(): GTELRenewalArcPrimingContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    primingGateSupport: 0.1,
    rechargeAnchor: 0.08,
    summary: 'Renewal arc priming continuity is holding primed gate against recharge anchor.',
  };
}

export function advanceRenewalArcPrimingContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeRenewalArcPrimingContinuitySmoothing(persisted.renewalArcPrimingContinuitySmoothing);
  const next = gtelClamp(prev * 0.34 + gtelClamp(rawScore, 0.16, 0.92) * 0.66, 0.16, 0.92);
  return { ...persisted, renewalArcPrimingContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeRenewalArcPrimingContinuitySnapshot(input: {
  bilateralRenewalArcPrimingGate: GTELBilateralRenewalArcPrimingGateSnapshot;
  forwardArcRechargeContinuity: GTELForwardArcRechargeContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELRenewalArcPrimingContinuitySnapshot; persisted: GTELPersisted } {
  const primingGateSupport =
    input.bilateralRenewalArcPrimingGate.band === 'primed'
      ? 0.18
      : input.bilateralRenewalArcPrimingGate.band === 'arming'
        ? 0.08
        : input.bilateralRenewalArcPrimingGate.band === 'idle'
          ? -0.04
          : -0.11;
  const rechargeAnchor =
    input.forwardArcRechargeContinuity.band === 'held'
      ? 0.14
      : input.forwardArcRechargeContinuity.band === 'lost'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralRenewalArcPrimingGate.score * 0.51 +
      input.forwardArcRechargeContinuity.score * 0.25 +
      primingGateSupport +
      rechargeAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceRenewalArcPrimingContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeRenewalArcPrimingContinuitySmoothing(persisted.renewalArcPrimingContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'settled'
      ? 'Renewal arc priming continuity is settled — primed gate and held recharge stay aligned.'
      : band === 'void'
        ? 'Priming continuity void; blocked gate and lost recharge diverged.'
        : band === 'unsettled'
          ? 'Continuity unsettled — recharge anchor is lagging priming gate.'
          : 'Renewal arc priming continuity is holding primed gate against recharge anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      primingGateSupport: Math.round(primingGateSupport * 1000) / 1000,
      rechargeAnchor: Math.round(rechargeAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function renewalArcPrimingContinuityExportScale(snapshot: GTELRenewalArcPrimingContinuitySnapshot): number {
  if (snapshot.band === 'settled') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'void') return gtelClamp(0.958 + snapshot.score * 0.005, 0.952, 0.97);
  if (snapshot.band === 'unsettled') return gtelClamp(0.991 + snapshot.score * 0.001, 0.986, 0.994);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function renewalArcPrimingContinuityDomesticStress(snapshot: GTELRenewalArcPrimingContinuitySnapshot): number {
  if (snapshot.band === 'void') return gtelClamp((0.25 - snapshot.score) * 0.03, 0.003, 0.015);
  if (snapshot.band === 'unsettled') return gtelClamp((0.37 - snapshot.score) * 0.012, 0.001, 0.005);
  return 0;
}

export function renewalArcPrimingContinuityWorldEvent(
  snapshot: GTELRenewalArcPrimingContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'void' && snapshot.band !== 'unsettled') return null;
  if (snapshot.primingGateSupport > -0.02) return null;
  return {
    id: `gtel_renew_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Renewal arc priming continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'SA'],
  };
}

export function renewalArcPrimingContinuityGiNotes(
  snapshot: GTELRenewalArcPrimingContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Renewal arc priming continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
