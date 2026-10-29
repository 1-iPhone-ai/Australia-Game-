import type {
  GTELExportCapacitySnapshot,
  GTELLogisticsStress,
  GTELPersisted,
  GTELMaritimeRiskSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELMaritimeRiskBand = GTELMaritimeRiskSnapshot['band'];

function maritimeBand(premium: number): GTELMaritimeRiskBand {
  if (premium >= 0.72) return 'blocked';
  if (premium >= 0.48) return 'severe';
  if (premium >= 0.28) return 'elevated';
  return 'calm';
}

export function sanitizeMaritimeRiskSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.22), 0.08, 0.88);
}

export function createEmptyMaritimeRiskSnapshot(): GTELMaritimeRiskSnapshot {
  return {
    premiumIndex: 0.22,
    band: 'calm',
    insuranceLoad: 0.04,
    laneReliability: 0.82,
    summary: 'Maritime insurance markets are calm on major export lanes.',
  };
}

export function advanceMaritimeRiskSmoothing(
  persisted: GTELPersisted,
  rawPremium: number,
): GTELPersisted {
  const prev = sanitizeMaritimeRiskSmoothing(persisted.maritimeRiskSmoothing);
  const next = gtelClamp(prev * 0.7 + gtelClamp(rawPremium, 0.08, 0.88) * 0.3, 0.08, 0.88);
  return { ...persisted, maritimeRiskSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeMaritimeRiskSnapshot(input: {
  logistics: GTELLogisticsStress;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  activeSanctionCount: number;
  exportCapacity: GTELExportCapacitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELMaritimeRiskSnapshot; persisted: GTELPersisted } {
  const logisticsLoad =
    input.logistics.band === 'congested'
      ? 0.28
      : input.logistics.band === 'tight'
        ? 0.18
        : input.logistics.band === 'watch'
          ? 0.08
          : 0.03;
  const retaliationLoad =
    input.tradeRetaliation.band === 'escalating'
      ? 0.22
      : input.tradeRetaliation.band === 'active'
        ? 0.14
        : input.tradeRetaliation.band === 'watch'
          ? 0.06
          : 0.02;
  const sanctionLoad = gtelClamp(input.activeSanctionCount * 0.09, 0, 0.26);
  const capacityLoad =
    input.exportCapacity.band === 'saturated'
      ? 0.1
      : input.exportCapacity.band === 'tight'
        ? 0.06
        : 0.02;
  const rawPremium = gtelClamp(
    0.16 + logisticsLoad + retaliationLoad + sanctionLoad + capacityLoad + input.logistics.networkStrain * 0.08,
    0.08,
    0.88,
  );
  const persisted = advanceMaritimeRiskSmoothing(input.persisted, rawPremium);
  const premiumIndex = sanitizeMaritimeRiskSmoothing(persisted.maritimeRiskSmoothing);
  const band = maritimeBand(premiumIndex);
  const insuranceLoad = gtelClamp(0.03 + premiumIndex * 0.22, 0.03, 0.28);
  const laneReliability = gtelClamp(0.92 - premiumIndex * 0.55 - logisticsLoad * 0.12, 0.35, 0.92);

  const summary =
    band === 'blocked'
      ? 'War-risk and sanctions clauses are blocking standard hull cover on several export corridors.'
      : band === 'severe'
        ? 'Maritime insurers are repricing premiums — charterers face steep surcharges.'
        : band === 'elevated'
          ? 'Shipping lanes carry elevated insurance load; minor reroutes are common.'
          : 'Maritime insurance markets are calm on major export lanes.';

  return {
    snapshot: {
      premiumIndex: Math.round(premiumIndex * 1000) / 1000,
      band,
      insuranceLoad: Math.round(insuranceLoad * 1000) / 1000,
      laneReliability: Math.round(laneReliability * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function maritimeRiskExportScale(snapshot: GTELMaritimeRiskSnapshot): number {
  if (snapshot.band === 'calm') return gtelClamp(1.01 - snapshot.premiumIndex * 0.02, 0.98, 1.02);
  if (snapshot.band === 'blocked') return gtelClamp(0.82 + snapshot.laneReliability * 0.08, 0.78, 0.9);
  if (snapshot.band === 'severe') return gtelClamp(0.88 + snapshot.laneReliability * 0.06, 0.84, 0.94);
  return gtelClamp(0.92 + snapshot.laneReliability * 0.05, 0.88, 0.98);
}

export function maritimeRiskDomesticStress(snapshot: GTELMaritimeRiskSnapshot): number {
  if (snapshot.band === 'blocked') return gtelClamp(snapshot.premiumIndex * 0.12, 0.04, 0.1);
  if (snapshot.band === 'severe') return gtelClamp(snapshot.premiumIndex * 0.08, 0.02, 0.07);
  if (snapshot.band === 'elevated') return gtelClamp(snapshot.premiumIndex * 0.04, 0, 0.04);
  return 0;
}

export function maritimeRiskFinanceDrag(snapshot: GTELMaritimeRiskSnapshot): number {
  return gtelClamp(snapshot.insuranceLoad * 0.35, 0, 0.12);
}

export function maritimeRiskWorldEvent(
  snapshot: GTELMaritimeRiskSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severe' && snapshot.band !== 'blocked') return null;
  if (snapshot.premiumIndex < 0.5) return null;
  return {
    id: `gtel_maritime_${turn}`,
    turn,
    kind: 'trade',
    title: 'Maritime insurance repricing',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function maritimeRiskGiNotes(maritime: GTELMaritimeRiskSnapshot | null | undefined): string[] {
  if (!maritime) return [];
  return [
    `Maritime risk premium: ${maritime.band} (${Math.round(maritime.premiumIndex * 100)}% index).`,
    maritime.summary,
  ];
}
