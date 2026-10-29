import type {
  GTELPartnerId,
  GTELPersisted,
  GTELPartnerAccessRestorationSnapshot,
  GTELTradeDeescalationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { GTEL_PARTNER_DEFS } from './constants.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELPartnerAccessRestorationBand = GTELPartnerAccessRestorationSnapshot['band'];

function restorationBand(momentum: number): GTELPartnerAccessRestorationBand {
  if (momentum >= 0.72) return 'reopened';
  if (momentum >= 0.52) return 'recovering';
  if (momentum >= 0.32) return 'partial';
  return 'stalled';
}

export function sanitizeAccessRestorationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.3), 0.1, 0.9);
}

export function createEmptyPartnerAccessRestorationSnapshot(): GTELPartnerAccessRestorationSnapshot {
  return {
    momentum: 0.3,
    band: 'stalled',
    restoredPartnerIds: [],
    accessRecoveryIndex: 0,
    summary: 'Partner gate restoration tracks have not yet reopened export lanes.',
  };
}

export function advanceAccessRestorationSmoothing(
  persisted: GTELPersisted,
  rawMomentum: number,
): GTELPersisted {
  const prev = sanitizeAccessRestorationSmoothing(persisted.accessRestorationSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawMomentum, 0.1, 0.9) * 0.27, 0.1, 0.9);
  return { ...persisted, accessRestorationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computePartnerAccessRestorationSnapshot(input: {
  tradeDeescalation: GTELTradeDeescalationSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELPartnerAccessRestorationSnapshot; persisted: GTELPersisted } {
  const deescalationLift =
    input.tradeDeescalation.band === 'breakthrough'
      ? 0.26
      : input.tradeDeescalation.band === 'warming'
        ? 0.16
        : input.tradeDeescalation.band === 'thawing'
          ? 0.08
          : 0.02;
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.22
      : input.tradeReconciliation.band === 'substantive'
        ? 0.14
        : input.tradeReconciliation.band === 'procedural'
          ? 0.06
          : 0;
  const attenuationLift = gtelClamp(input.tradeDeescalation.retaliationAttenuation * 0.85, 0, 0.12);
  const rawMomentum = gtelClamp(
    0.2 + deescalationLift + reconciliationLift + attenuationLift,
    0.1,
    0.9,
  );
  const persisted = advanceAccessRestorationSmoothing(input.persisted, rawMomentum);
  const momentum = sanitizeAccessRestorationSmoothing(persisted.accessRestorationSmoothing);
  const band = restorationBand(momentum);

  const restoredPartnerIds: GTELPartnerId[] = [];
  const cooling = new Set(input.tradeDeescalation.coolingPartnerIds);
  const reconciled = new Set(input.tradeReconciliation.reconciledPartnerIds);
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    if (momentum > 0.38 && (cooling.has(p.id) || reconciled.has(p.id))) {
      restoredPartnerIds.push(p.id);
    }
  });

  const accessRecoveryIndex =
    band === 'reopened'
      ? gtelClamp(momentum * 0.14 + restoredPartnerIds.length * 0.03, 0.04, 0.18)
      : band === 'recovering'
        ? gtelClamp(momentum * 0.1 + restoredPartnerIds.length * 0.025, 0.02, 0.12)
        : band === 'partial'
          ? gtelClamp(momentum * 0.06, 0, 0.06)
          : 0;

  const summary =
    band === 'reopened'
      ? 'Restoration panels are reopening partner gates on previously restricted export lanes.'
      : band === 'recovering'
        ? 'Confidence measures are restoring bilateral access on priority partner markets.'
        : band === 'partial'
          ? 'Limited partner access restoration is underway but remains fragile.'
          : 'Partner gate restoration tracks have not yet reopened export lanes.';

  return {
    snapshot: {
      momentum: Math.round(momentum * 1000) / 1000,
      band,
      restoredPartnerIds: restoredPartnerIds.slice(0, 4),
      accessRecoveryIndex: Math.round(accessRecoveryIndex * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function deriveAccessRestorationPartnerModifiers(snapshot: GTELPartnerAccessRestorationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStressRelief: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'stalled') {
    return { partnerDeltas, domesticStressRelief: 0 };
  }
  const lift =
    snapshot.band === 'reopened' ? 0.07 : snapshot.band === 'recovering' ? 0.05 : 0.03;
  snapshot.restoredPartnerIds.forEach(id => {
    partnerDeltas[id] = gtelNum(partnerDeltas[id], 0) + lift;
  });
  const domesticStressRelief =
    snapshot.band === 'reopened'
      ? gtelClamp(snapshot.accessRecoveryIndex * 0.35, 0, 0.05)
      : snapshot.band === 'recovering'
        ? gtelClamp(snapshot.accessRecoveryIndex * 0.28, 0, 0.035)
        : gtelClamp(snapshot.accessRecoveryIndex * 0.2, 0, 0.02);
  return { partnerDeltas, domesticStressRelief };
}

export function partnerAccessRestorationWorldEvent(
  snapshot: GTELPartnerAccessRestorationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'recovering' && snapshot.band !== 'reopened') return null;
  if (snapshot.restoredPartnerIds.length < 1) return null;
  return {
    id: `gtel_access_restore_${turn}`,
    turn,
    kind: 'diplomacy',
    title: 'Partner access restoration',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'QLD'],
  };
}

export function partnerAccessRestorationGiNotes(
  restoration: GTELPartnerAccessRestorationSnapshot | null | undefined,
): string[] {
  if (!restoration) return [];
  return [
    `Partner access restoration: ${restoration.band.replace(/_/g, ' ')} (${Math.round(restoration.momentum * 100)}% momentum).`,
    restoration.summary,
  ];
}
