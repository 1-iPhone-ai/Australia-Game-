import type {
  GTELBilateralTradeWindowContinuitySnapshot,
  GTELCertifiedThroughputSustainmentSnapshot,
  GTELPersisted,
  GTELTradeCycleSealVerificationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeCycleSealVerificationBand = GTELTradeCycleSealVerificationSnapshot['band'];

function sealBand(score: number): GTELTradeCycleSealVerificationBand {
  if (score >= 0.85) return 'verified';
  if (score >= 0.65) return 'provisional';
  if (score >= 0.47) return 'contested';
  return 'failed';
}

export function sanitizeTradeCycleSealVerificationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyTradeCycleSealVerificationSnapshot(): GTELTradeCycleSealVerificationSnapshot {
  return {
    score: 0.52,
    band: 'provisional',
    continuitySupport: 0.1,
    sustainmentAnchor: 0.08,
    summary: 'Trade cycle seal is provisional pending window continuity confirmation.',
  };
}

export function advanceTradeCycleSealVerificationSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeTradeCycleSealVerificationSmoothing(persisted.tradeCycleSealVerificationSmoothing);
  const next = gtelClamp(prev * 0.56 + gtelClamp(rawScore, 0.16, 0.92) * 0.44, 0.16, 0.92);
  return { ...persisted, tradeCycleSealVerificationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeCycleSealVerificationSnapshot(input: {
  bilateralTradeWindowContinuity: GTELBilateralTradeWindowContinuitySnapshot;
  certifiedThroughputSustainment: GTELCertifiedThroughputSustainmentSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeCycleSealVerificationSnapshot; persisted: GTELPersisted } {
  const continuitySupport =
    input.bilateralTradeWindowContinuity.band === 'continuous'
      ? 0.17
      : input.bilateralTradeWindowContinuity.band === 'bridging'
        ? 0.08
        : input.bilateralTradeWindowContinuity.band === 'gapped'
          ? -0.04
          : -0.11;
  const sustainmentAnchor =
    input.certifiedThroughputSustainment.band === 'sustained'
      ? 0.13
      : input.certifiedThroughputSustainment.band === 'exhausted'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralTradeWindowContinuity.score * 0.48 +
      input.certifiedThroughputSustainment.score * 0.24 +
      continuitySupport +
      sustainmentAnchor +
      input.bilateralTradeWindowContinuity.absorptionSupport * 0.1,
    0.16,
    0.92,
  );
  const persisted = advanceTradeCycleSealVerificationSmoothing(input.persisted, rawScore);
  const score = sanitizeTradeCycleSealVerificationSmoothing(persisted.tradeCycleSealVerificationSmoothing);
  const band = sealBand(score);

  const summary =
    band === 'verified'
      ? 'Trade cycle seal is verified — window continuity and sustainment anchor the closed cycle.'
      : band === 'failed'
        ? 'Cycle seal verification failed; continuity broke before the turn could close.'
        : band === 'contested'
          ? 'Seal is contested — sustainment drift is challenging continuity claims.'
          : 'Trade cycle seal is provisional pending window continuity confirmation.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuitySupport: Math.round(continuitySupport * 1000) / 1000,
      sustainmentAnchor: Math.round(sustainmentAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeCycleSealVerificationExportScale(snapshot: GTELTradeCycleSealVerificationSnapshot): number {
  if (snapshot.band === 'verified') return gtelClamp(1 + snapshot.score * 0.009, 1, 1.015);
  if (snapshot.band === 'failed') return gtelClamp(0.955 + snapshot.score * 0.022, 0.94, 0.97);
  if (snapshot.band === 'contested') return gtelClamp(0.98 + snapshot.score * 0.012, 0.96, 0.99);
  return gtelClamp(0.977 + snapshot.score * 0.004, 0.95, 1.02);
}

export function tradeCycleSealVerificationDomesticStress(snapshot: GTELTradeCycleSealVerificationSnapshot): number {
  if (snapshot.band === 'failed') return gtelClamp((0.31 - snapshot.score) * 0.07, 0.008, 0.04);
  if (snapshot.band === 'contested') return gtelClamp((0.44 - snapshot.score) * 0.038, 0.004, 0.022);
  return 0;
}

export function tradeCycleSealVerificationWorldEvent(
  snapshot: GTELTradeCycleSealVerificationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'failed' && snapshot.band !== 'contested') return null;
  if (snapshot.continuitySupport > -0.02) return null;
  return {
    id: `gtel_cycle_seal_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade cycle seal under challenge',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function tradeCycleSealVerificationGiNotes(
  snapshot: GTELTradeCycleSealVerificationSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Trade cycle seal verification: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
