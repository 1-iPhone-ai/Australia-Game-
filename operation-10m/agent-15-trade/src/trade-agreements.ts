import { GTEL_COMMODITIES, GTEL_LIMITS, GTEL_PARTNER_DEFS } from './constants.ts';
import type {
  GTELCommodityId,
  GTELPartnerId,
  GTELPersisted,
  TradeAgreementRecord,
  TradeAgreementTariffLine,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface TradeAgreementTemplate {
  id: string;
  title: string;
  partnerId: GTELPartnerId;
  defaultDurationTurns: number;
  accessBoost: number;
  tariffLines: TradeAgreementTariffLine[];
  summary: string;
}

export const TRADE_AGREEMENT_TEMPLATES: TradeAgreementTemplate[] = [
  {
    id: 'fta_asia_bulk',
    title: 'Asia–Pacific bulk commodities FTA',
    partnerId: 'asia_pacific',
    defaultDurationTurns: 24,
    accessBoost: 0.12,
    tariffLines: [
      { commodity: 'iron_ore', tariffCut: 0.08 },
      { commodity: 'coal', tariffCut: 0.06 },
      { commodity: 'lng', tariffCut: 0.05 },
    ],
    summary: 'Cuts bulk export frictions with Asia–Pacific buyers.',
  },
  {
    id: 'services_eu_mutual',
    title: 'EU–Australia services recognition pact',
    partnerId: 'europe',
    defaultDurationTurns: 18,
    accessBoost: 0.08,
    tariffLines: [{ commodity: 'services', tariffCut: 0.1 }],
    summary: 'Professional services exports face lower non-tariff barriers in Europe.',
  },
  {
    id: 'agri_asean',
    title: 'ASEAN agricultural corridor',
    partnerId: 'india_ocean',
    defaultDurationTurns: 16,
    accessBoost: 0.07,
    tariffLines: [
      { commodity: 'wheat', tariffCut: 0.07, quotaCap: 5000 },
      { commodity: 'beef', tariffCut: 0.05, quotaCap: 3000 },
    ],
    summary: 'Quota-managed wheat and beef access into Indian Ocean markets.',
  },
  {
    id: 'domestic_premium_anchor',
    title: 'Domestic premium supply anchor',
    partnerId: 'domestic_premium',
    defaultDurationTurns: 12,
    accessBoost: 0.04,
    tariffLines: [
      { commodity: 'wheat', tariffCut: 0.03 },
      { commodity: 'manufacturing', tariffCut: 0.04 },
    ],
    summary: 'Stabilises domestic premium channels when export markets tighten.',
  },
];

export function getTradeAgreementTemplate(templateId: string): TradeAgreementTemplate | null {
  return TRADE_AGREEMENT_TEMPLATES.find(t => t.id === templateId) || null;
}

export function createTradeAgreementFromTemplate(
  templateId: string,
  turn: number,
  counterpartyActorIds: string[],
  overrides: Partial<Pick<TradeAgreementRecord, 'id' | 'title'>> = {},
): TradeAgreementRecord | null {
  const tpl = getTradeAgreementTemplate(templateId);
  if (!tpl) return null;
  const id = overrides.id || `ta_${templateId}_${turn}`;
  return {
    id: id.slice(0, 80),
    templateId: tpl.id,
    title: (overrides.title || tpl.title).slice(0, 120),
    partnerId: tpl.partnerId,
    counterpartyActorIds: counterpartyActorIds.slice(0, 4),
    status: 'negotiating',
    ratifiedTurn: null,
    expiresTurn: turn + tpl.defaultDurationTurns,
    tariffLines: tpl.tariffLines.map(l => ({ ...l })),
    accessBoost: tpl.accessBoost,
    notes: [tpl.summary],
  };
}

export function ratifyTradeAgreement(agreement: TradeAgreementRecord, turn: number): TradeAgreementRecord {
  if (agreement.status === 'ratified') return agreement;
  return {
    ...agreement,
    status: 'ratified',
    ratifiedTurn: turn,
    expiresTurn: agreement.expiresTurn ?? turn + 12,
    notes: [...agreement.notes, `Ratified turn ${turn}.`],
  };
}

export function expireStaleAgreements(persisted: GTELPersisted, turn: number): TradeAgreementRecord[] {
  return persisted.agreements.map(a => {
    if (a.status === 'ratified' && a.expiresTurn != null && turn > a.expiresTurn) {
      return { ...a, status: 'expired' as const, notes: [...a.notes, `Expired after turn ${a.expiresTurn}.`] };
    }
    return a;
  });
}

/** Modifiers from ratified structured agreements (stacked with diplomacy deals). */
export function deriveTradeAgreementModifiers(persisted: GTELPersisted, turn: number): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  const notes: string[] = [];
  const active = persisted.agreements.filter(
    a => a.status === 'ratified' && (a.expiresTurn == null || turn <= a.expiresTurn),
  );
  active.forEach(a => {
    partnerDeltas[a.partnerId] = (partnerDeltas[a.partnerId] || 0) + a.accessBoost;
    a.tariffLines.forEach(line => {
      if (!GTEL_COMMODITIES.includes(line.commodity)) return;
      commodityDeltas[line.commodity] = (commodityDeltas[line.commodity] || 0) + line.tariffCut * 0.35;
    });
    notes.push(`${a.title} (${GTEL_PARTNER_DEFS.find(p => p.id === a.partnerId)?.label || a.partnerId}) is active.`);
  });
  if (active.length >= GTEL_LIMITS.maxAgreements - 2) {
    notes.push('Agreement portfolio is near capacity — renegotiation may be required.');
  }
  return { partnerDeltas, commodityDeltas, notes };
}

export function mergePartnerDeltas(
  a: Partial<Record<GTELPartnerId, number>>,
  b: Partial<Record<GTELPartnerId, number>>,
): Partial<Record<GTELPartnerId, number>> {
  const out: Partial<Record<GTELPartnerId, number>> = { ...a };
  Object.entries(b).forEach(([k, v]) => {
    const id = k as GTELPartnerId;
    out[id] = gtelClamp(gtelNum(out[id], 0) + gtelNum(v, 0), -0.5, 0.5);
  });
  return out;
}

export function mergeCommodityDeltas(
  a: Partial<Record<GTELCommodityId, number>>,
  b: Partial<Record<GTELCommodityId, number>>,
): Partial<Record<GTELCommodityId, number>> {
  const out: Partial<Record<GTELCommodityId, number>> = { ...a };
  Object.entries(b).forEach(([k, v]) => {
    const id = k as GTELCommodityId;
    out[id] = gtelClamp(gtelNum(out[id], 0) + gtelNum(v, 0), -0.4, 0.4);
  });
  return out;
}
