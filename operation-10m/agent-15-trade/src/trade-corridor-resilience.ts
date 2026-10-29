import type {
  GTELLogisticsStress,
  GTELMaritimeRiskSnapshot,
  GTELMarketDiversificationSnapshot,
  GTELPersisted,
  GTELSupplyChainResilienceSnapshot,
  GTELTradeCorridorResilienceSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeCorridorBand = GTELTradeCorridorResilienceSnapshot['band'];

function corridorBand(score: number): GTELTradeCorridorBand {
  if (score >= 0.74) return 'robust';
  if (score >= 0.52) return 'stable';
  if (score >= 0.34) return 'fragile';
  return 'disrupted';
}

export function sanitizeTradeCorridorSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.54), 0.2, 0.9);
}

export function createEmptyTradeCorridorResilienceSnapshot(): GTELTradeCorridorResilienceSnapshot {
  return {
    score: 0.54,
    band: 'stable',
    chokepointLoad: 0.22,
    rerouteCapacity: 0.58,
    summary: 'Major export corridors are operating with normal redundancy.',
  };
}

export function advanceTradeCorridorSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeTradeCorridorSmoothing(persisted.tradeCorridorSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawScore, 0.2, 0.9) * 0.28, 0.2, 0.9);
  return { ...persisted, tradeCorridorSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeCorridorResilienceSnapshot(input: {
  logistics: GTELLogisticsStress;
  maritimeRisk: GTELMaritimeRiskSnapshot;
  supplyChainResilience: GTELSupplyChainResilienceSnapshot;
  marketDiversification: GTELMarketDiversificationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeCorridorResilienceSnapshot; persisted: GTELPersisted } {
  const logisticsLift =
    input.logistics.band === 'fluid'
      ? 0.18
      : input.logistics.band === 'watch'
        ? 0.1
        : input.logistics.band === 'tight'
          ? 0.04
          : -0.06;
  const maritimeLift = gtelClamp(input.maritimeRisk.laneReliability * 0.22 - input.maritimeRisk.premiumIndex * 0.12, -0.1, 0.14);
  const resilienceLift = gtelClamp(input.supplyChainResilience.score * 0.28, 0.05, 0.22);
  const diversificationLift =
    input.marketDiversification.band === 'well_spread'
      ? 0.1
      : input.marketDiversification.band === 'balanced'
        ? 0.05
        : input.marketDiversification.band === 'concentrated'
          ? -0.04
          : -0.08;
  const rawScore = gtelClamp(
    0.42 + logisticsLift + maritimeLift + resilienceLift + diversificationLift - input.logistics.networkStrain * 0.08,
    0.2,
    0.9,
  );
  const persisted = advanceTradeCorridorSmoothing(input.persisted, rawScore);
  const score = sanitizeTradeCorridorSmoothing(persisted.tradeCorridorSmoothing);
  const band = corridorBand(score);
  const chokepointLoad = gtelClamp(
    (input.supplyChainResilience.chokepointCount / 6) * 0.18 +
      (input.logistics.band === 'congested' ? 0.22 : 0.08) +
      input.maritimeRisk.premiumIndex * 0.1,
    0.08,
    0.62,
  );
  const rerouteCapacity = gtelClamp(
    score * 0.45 + input.marketDiversification.effectivePartnerCount * 0.04 + input.maritimeRisk.laneReliability * 0.12,
    0.22,
    0.88,
  );

  const summary =
    band === 'robust'
      ? 'Export corridors retain strong redundancy — reroutes absorb lane shocks without rationing.'
      : band === 'disrupted'
        ? 'Multiple corridor chokepoints are binding; planners should expect shipment delays.'
        : band === 'fragile'
          ? 'Corridor redundancy is thin; minor lane shocks could cascade into export rationing.'
          : 'Major export corridors are operating with normal redundancy.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      chokepointLoad: Math.round(chokepointLoad * 1000) / 1000,
      rerouteCapacity: Math.round(rerouteCapacity * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeCorridorExportScale(snapshot: GTELTradeCorridorResilienceSnapshot): number {
  if (snapshot.band === 'robust') return gtelClamp(1 + snapshot.rerouteCapacity * 0.03, 1, 1.04);
  if (snapshot.band === 'disrupted') return gtelClamp(0.82 + snapshot.score * 0.08, 0.78, 0.88);
  if (snapshot.band === 'fragile') return gtelClamp(0.9 + snapshot.score * 0.06, 0.86, 0.95);
  return gtelClamp(0.96 + snapshot.score * 0.03, 0.92, 1.02);
}

export function tradeCorridorDomesticStress(snapshot: GTELTradeCorridorResilienceSnapshot): number {
  if (snapshot.band === 'disrupted') return gtelClamp(snapshot.chokepointLoad * 0.14, 0.04, 0.09);
  if (snapshot.band === 'fragile') return gtelClamp(snapshot.chokepointLoad * 0.08, 0.02, 0.06);
  return 0;
}

export function tradeCorridorWorldEvent(
  snapshot: GTELTradeCorridorResilienceSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'fragile' && snapshot.band !== 'disrupted') return null;
  if (snapshot.chokepointLoad < 0.35) return null;
  return {
    id: `gtel_corridor_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export corridor stress',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function tradeCorridorGiNotes(
  corridor: GTELTradeCorridorResilienceSnapshot | null | undefined,
): string[] {
  if (!corridor) return [];
  return [
    `Trade corridor resilience: ${corridor.band} (${Math.round(corridor.score * 100)}% score).`,
    corridor.summary,
  ];
}
