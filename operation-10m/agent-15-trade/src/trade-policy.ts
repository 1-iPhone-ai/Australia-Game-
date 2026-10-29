import { GTEL_COMMODITIES, GTEL_PARTNER_DEFS } from './constants.ts';
import type {
  GTELCommodityId,
  GTELPartnerId,
  GTELPersisted,
  TradePolicyInstrument,
  TradePolicyKind,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export const TRADE_POLICY_CATALOG: Array<Omit<TradePolicyInstrument, 'id' | 'status' | 'activatedTurn'>> = [
  {
    kind: 'export_quota_relief',
    title: 'Export quota relief lane',
    partnerId: 'asia_pacific',
    commodity: 'iron_ore',
    expiresTurn: null,
    accessDelta: 0.06,
    commodityDelta: 0.04,
    domesticStressDelta: -0.02,
    summary: 'Temporary quota headroom for bulk exports to Asia–Pacific.',
  },
  {
    kind: 'tariff_surge',
    title: 'Defensive tariff surge',
    partnerId: 'europe',
    commodity: 'manufacturing',
    expiresTurn: null,
    accessDelta: -0.05,
    commodityDelta: -0.03,
    domesticStressDelta: 0.04,
    summary: 'Retaliatory tariff posture after partner market restrictions.',
  },
  {
    kind: 'preferential_lane',
    title: 'Preferential services lane',
    partnerId: 'north_america',
    commodity: 'services',
    expiresTurn: null,
    accessDelta: 0.05,
    commodityDelta: 0.03,
    domesticStressDelta: 0,
    summary: 'Fast-track professional services export clearance.',
  },
  {
    kind: 'diversification_push',
    title: 'Market diversification push',
    partnerId: null,
    commodity: null,
    expiresTurn: null,
    accessDelta: 0.03,
    commodityDelta: 0.01,
    domesticStressDelta: -0.01,
    summary: 'Incentives to spread export dependence across partner markets.',
  },
];

export function createTradePolicyInstrument(
  kind: TradePolicyKind,
  turn: number,
  durationTurns = 8,
  overrides: Partial<Pick<TradePolicyInstrument, 'partnerId' | 'commodity' | 'title'>> = {},
): TradePolicyInstrument | null {
  const tpl = TRADE_POLICY_CATALOG.find(p => p.kind === kind);
  if (!tpl) return null;
  return {
    id: `tp_${kind}_${turn}`,
    kind,
    title: overrides.title || tpl.title,
    partnerId: overrides.partnerId ?? tpl.partnerId,
    commodity: overrides.commodity ?? tpl.commodity,
    status: 'active',
    activatedTurn: turn,
    expiresTurn: turn + durationTurns,
    accessDelta: tpl.accessDelta,
    commodityDelta: tpl.commodityDelta,
    domesticStressDelta: tpl.domesticStressDelta,
    summary: tpl.summary,
  };
}

export function expireTradePolicies(persisted: GTELPersisted, turn: number): TradePolicyInstrument[] {
  return (persisted.tradePolicies || []).map(p => {
    if (p.status === 'active' && p.expiresTurn != null && turn > p.expiresTurn) {
      return { ...p, status: 'expired' as const };
    }
    return p;
  });
}

/** Auto-activate diversification push when multiple partners are restricted. */
export function autoTradePolicyAdjustments(persisted: GTELPersisted, turn: number): GTELPersisted {
  let policies = expireTradePolicies(persisted, turn);
  const restricted = GTEL_PARTNER_DEFS.filter(
    p => p.id !== 'domestic_premium' && (persisted.partnerAccess[p.id] === 'blocked' || persisted.partnerAccess[p.id] === 'restricted'),
  ).length;
  const hasDiversification = policies.some(p => p.kind === 'diversification_push' && p.status === 'active');
  if (restricted >= 2 && !hasDiversification) {
    const inst = createTradePolicyInstrument('diversification_push', turn, 10);
    if (inst) policies = [...policies, inst].slice(-8);
  }
  return { ...persisted, tradePolicies: policies };
}

export function deriveTradePolicyModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  domesticStress: number;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  let domesticStress = 0;
  const notes: string[] = [];

  (persisted.tradePolicies || [])
    .filter(p => p.status === 'active')
    .forEach(p => {
      if (p.kind === 'diversification_push') {
        GTEL_PARTNER_DEFS.filter(x => x.id !== 'domestic_premium').forEach(x => {
          partnerDeltas[x.id] = (partnerDeltas[x.id] || 0) + p.accessDelta / 4;
        });
      } else if (p.partnerId) {
        partnerDeltas[p.partnerId] = (partnerDeltas[p.partnerId] || 0) + p.accessDelta;
      }
      if (p.commodity && GTEL_COMMODITIES.includes(p.commodity)) {
        commodityDeltas[p.commodity] = (commodityDeltas[p.commodity] || 0) + p.commodityDelta;
      }
      domesticStress += gtelNum(p.domesticStressDelta, 0);
      notes.push(`Policy active: ${p.title}.`);
    });

  return {
    partnerDeltas,
    commodityDeltas,
    domesticStress: gtelClamp(domesticStress, -0.05, 0.15),
    notes,
  };
}

export function listActiveTradePolicies(persisted: GTELPersisted): TradePolicyInstrument[] {
  return (persisted.tradePolicies || []).filter(p => p.status === 'active');
}
