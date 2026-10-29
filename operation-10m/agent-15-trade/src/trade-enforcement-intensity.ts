import type {
  GTELPartnerId,
  GTELPersisted,
  GTELTradeComplianceRecord,
  GTELTradeEnforcementSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeEnforcementBand = GTELTradeEnforcementSnapshot['band'];

function enforcementBand(intensity: number): GTELTradeEnforcementBand {
  if (intensity >= 0.72) return 'sweep';
  if (intensity >= 0.48) return 'intensive';
  if (intensity >= 0.28) return 'active';
  return 'light';
}

export function sanitizeEnforcementIntensitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.26), 0.08, 0.88);
}

export function createEmptyTradeEnforcementSnapshot(): GTELTradeEnforcementSnapshot {
  return {
    intensity: 0.26,
    band: 'light',
    probeLoad: 0.05,
    clearanceDelayTurns: 0,
    summary: 'Customs enforcement is at routine inspection levels.',
  };
}

export function advanceEnforcementIntensitySmoothing(
  persisted: GTELPersisted,
  rawIntensity: number,
): GTELPersisted {
  const prev = sanitizeEnforcementIntensitySmoothing(persisted.enforcementIntensitySmoothing);
  const next = gtelClamp(prev * 0.71 + gtelClamp(rawIntensity, 0.08, 0.88) * 0.29, 0.08, 0.88);
  return { ...persisted, enforcementIntensitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeEnforcementSnapshot(input: {
  openDisputeCount: number;
  tradeCompliance: GTELTradeComplianceRecord;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeEnforcementSnapshot; persisted: GTELPersisted } {
  const complianceGap =
    input.tradeCompliance.band === 'critical'
      ? 0.28
      : input.tradeCompliance.band === 'weak'
        ? 0.18
        : input.tradeCompliance.band === 'adequate'
          ? 0.08
          : 0.03;
  const disputeLoad = gtelClamp(input.openDisputeCount * 0.12, 0, 0.36);
  const retaliationLoad =
    input.tradeRetaliation.band === 'escalating'
      ? 0.2
      : input.tradeRetaliation.band === 'active'
        ? 0.12
        : input.tradeRetaliation.band === 'watch'
          ? 0.05
          : 0.02;
  const reconciliationRelief =
    input.tradeReconciliation.band === 'settled'
      ? 0.14
      : input.tradeReconciliation.band === 'substantive'
        ? 0.08
        : input.tradeReconciliation.band === 'procedural'
          ? 0.04
          : 0;
  const rawIntensity = gtelClamp(
    0.14 + complianceGap + disputeLoad + retaliationLoad - reconciliationRelief,
    0.08,
    0.88,
  );
  const persisted = advanceEnforcementIntensitySmoothing(input.persisted, rawIntensity);
  const intensity = sanitizeEnforcementIntensitySmoothing(persisted.enforcementIntensitySmoothing);
  const band = enforcementBand(intensity);
  const probeLoad = gtelClamp(0.04 + intensity * 0.22, 0.04, 0.26);
  const clearanceDelayTurns =
    band === 'sweep' ? 2 : band === 'intensive' ? 1 : band === 'active' ? 1 : 0;

  const summary =
    band === 'sweep'
      ? 'Partner customs agencies are running sweeping compliance probes on export declarations.'
      : band === 'intensive'
        ? 'Rules-of-origin audits and document checks are delaying several export lanes.'
        : band === 'active'
          ? 'Enforcement activity is elevated but still targeted rather than economy-wide.'
          : 'Customs enforcement is at routine inspection levels.';

  return {
    snapshot: {
      intensity: Math.round(intensity * 1000) / 1000,
      band,
      probeLoad: Math.round(probeLoad * 1000) / 1000,
      clearanceDelayTurns,
      summary,
    },
    persisted,
  };
}

export function deriveEnforcementPartnerModifiers(snapshot: GTELTradeEnforcementSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'light') {
    return { partnerDeltas, domesticStress: 0 };
  }
  const penalty =
    snapshot.band === 'sweep' ? -0.06 : snapshot.band === 'intensive' ? -0.04 : -0.02;
  (['asia_pacific', 'europe', 'north_america', 'india_ocean'] as GTELPartnerId[]).forEach(id => {
    partnerDeltas[id] = penalty;
  });
  const domesticStress =
    snapshot.band === 'sweep'
      ? gtelClamp(snapshot.intensity * 0.1, 0.04, 0.09)
      : snapshot.band === 'intensive'
        ? gtelClamp(snapshot.intensity * 0.07, 0.02, 0.06)
        : gtelClamp(snapshot.intensity * 0.04, 0, 0.04);
  return { partnerDeltas, domesticStress };
}

export function enforcementExportScale(snapshot: GTELTradeEnforcementSnapshot): number {
  if (snapshot.band === 'light') return gtelClamp(1 - snapshot.probeLoad * 0.08, 0.97, 1);
  if (snapshot.band === 'sweep') return gtelClamp(0.86 + (1 - snapshot.intensity) * 0.08, 0.82, 0.9);
  if (snapshot.band === 'intensive') return gtelClamp(0.9 + (1 - snapshot.intensity) * 0.06, 0.86, 0.94);
  return gtelClamp(0.94 + (1 - snapshot.intensity) * 0.04, 0.9, 0.98);
}

export function tradeEnforcementWorldEvent(
  snapshot: GTELTradeEnforcementSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'intensive' && snapshot.band !== 'sweep') return null;
  if (snapshot.intensity < 0.45) return null;
  return {
    id: `gtel_enforcement_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade enforcement surge',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function tradeEnforcementGiNotes(
  enforcement: GTELTradeEnforcementSnapshot | null | undefined,
): string[] {
  if (!enforcement) return [];
  return [
    `Trade enforcement: ${enforcement.band} (${Math.round(enforcement.intensity * 100)}% intensity).`,
    enforcement.summary,
  ];
}
