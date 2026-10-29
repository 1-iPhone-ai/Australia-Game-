import type {
  ActiveWorldTradeShock,
  GTELCommodityId,
  GTELPartnerId,
  GTELPersisted,
  WorldTradeShockDefinition,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export const WORLD_TRADE_SHOCK_CATALOG: WorldTradeShockDefinition[] = [
  {
    id: 'shock_suez_style',
    kind: 'shipping_disruption',
    title: 'Global shipping lane disruption',
    summary: 'Freight bottlenecks raise export costs and delay partner deliveries.',
    durationTurns: 5,
    partnerIds: ['asia_pacific', 'india_ocean', 'europe'],
    commodityDeltas: { manufacturing: -0.06, services: -0.04 },
    partnerAccessDelta: -0.1,
    domesticStress: 0.08,
    regionIds: ['NSW', 'VIC', 'QLD'],
  },
  {
    id: 'shock_iron_crash',
    kind: 'commodity_crash',
    title: 'Iron ore price collapse',
    summary: 'Bulk buyers pull back; mining regions feel the squeeze first.',
    durationTurns: 6,
    partnerIds: ['asia_pacific'],
    commodityDeltas: { iron_ore: -0.18, coal: -0.06 },
    partnerAccessDelta: -0.05,
    domesticStress: 0.12,
    regionIds: ['WA', 'QLD'],
  },
  {
    id: 'shock_lng_spike',
    kind: 'commodity_spike',
    title: 'LNG spot spike',
    summary: 'Energy export premiums jump while households face pass-through pressure.',
    durationTurns: 4,
    partnerIds: ['asia_pacific', 'north_america'],
    commodityDeltas: { lng: 0.14, services: 0.03 },
    partnerAccessDelta: 0.06,
    domesticStress: 0.1,
    regionIds: ['WA', 'QLD', 'NSW'],
  },
  {
    id: 'shock_eu_embargo',
    kind: 'partner_embargo',
    title: 'Partial European market embargo',
    summary: 'Compliance disputes block a slice of services and aluminium exports.',
    durationTurns: 7,
    partnerIds: ['europe'],
    commodityDeltas: { aluminium: -0.1, services: -0.08 },
    partnerAccessDelta: -0.2,
    domesticStress: 0.09,
    regionIds: ['VIC', 'NSW', 'SA'],
  },
  {
    id: 'shock_supply_chain',
    kind: 'supply_chain',
    title: 'Manufacturing input shortage',
    summary: 'Imported components stall; manufacturing export indices soften.',
    durationTurns: 5,
    partnerIds: ['north_america', 'asia_pacific'],
    commodityDeltas: { manufacturing: -0.12, coal: -0.03 },
    partnerAccessDelta: -0.07,
    domesticStress: 0.07,
    regionIds: ['VIC', 'SA', 'NSW'],
  },
  {
    id: 'shock_financial_contagion',
    kind: 'financial_contagion',
    title: 'Trade finance tightening',
    summary: 'Letters of credit cost more; all partner gates slip one band.',
    durationTurns: 4,
    partnerIds: ['asia_pacific', 'india_ocean', 'north_america', 'europe'],
    commodityDeltas: { services: -0.05, beef: -0.04, wheat: -0.04 },
    partnerAccessDelta: -0.12,
    domesticStress: 0.11,
    regionIds: ['NSW', 'VIC', 'WA'],
  },
  {
    id: 'shock_coal_softening',
    kind: 'commodity_crash',
    title: 'Coal export softening',
    summary: 'Thermal coal buyers delay cargoes; QLD and NSW networks feel idle capacity.',
    durationTurns: 5,
    partnerIds: ['asia_pacific', 'india_ocean'],
    commodityDeltas: { coal: -0.11, manufacturing: -0.02 },
    partnerAccessDelta: -0.04,
    domesticStress: 0.07,
    regionIds: ['QLD', 'NSW'],
  },
  {
    id: 'shock_wheat_drought',
    kind: 'commodity_crash',
    title: 'Wheat belt drought',
    summary: 'Domestic and export wheat quotes weaken on yield downgrades.',
    durationTurns: 6,
    partnerIds: ['india_ocean', 'domestic_premium'],
    commodityDeltas: { wheat: -0.14, beef: -0.03 },
    partnerAccessDelta: -0.03,
    domesticStress: 0.09,
    regionIds: ['NSW', 'SA', 'VIC'],
  },
  {
    id: 'shock_beef_access',
    kind: 'partner_embargo',
    title: 'Beef market access friction',
    summary: 'Sanitary and quota disputes delay beef consignments to key buyers.',
    durationTurns: 5,
    partnerIds: ['north_america', 'india_ocean'],
    commodityDeltas: { beef: -0.12, services: -0.02 },
    partnerAccessDelta: -0.09,
    domesticStress: 0.08,
    regionIds: ['QLD', 'TAS', 'NSW'],
  },
  {
    id: 'shock_aluminium_retaliation',
    kind: 'sanctions_retaliation',
    title: 'Aluminium tariff retaliation',
    summary: 'Retaliatory duties hit aluminium and downstream manufacturing exports.',
    durationTurns: 6,
    partnerIds: ['europe', 'north_america'],
    commodityDeltas: { aluminium: -0.15, manufacturing: -0.07 },
    partnerAccessDelta: -0.14,
    domesticStress: 0.1,
    regionIds: ['VIC', 'SA', 'NSW'],
  },
];

export function getWorldTradeShockDefinition(shockId: string): WorldTradeShockDefinition | null {
  return WORLD_TRADE_SHOCK_CATALOG.find(s => s.id === shockId) || null;
}

export function activateWorldTradeShock(
  persisted: GTELPersisted,
  shockId: string,
  turn: number,
): { persisted: GTELPersisted; activated: ActiveWorldTradeShock | null } {
  const def = getWorldTradeShockDefinition(shockId);
  if (!def) return { persisted, activated: null };
  if (persisted.activeShocks.some(s => s.shockId === shockId && turn <= s.endsTurn)) {
    return { persisted, activated: null };
  }
  const active: ActiveWorldTradeShock = {
    shockId: def.id,
    startedTurn: turn,
    endsTurn: turn + def.durationTurns,
    remainingIntensity: 1,
  };
  return {
    persisted: { ...persisted, activeShocks: [...persisted.activeShocks, active].slice(-8) },
    activated: active,
  };
}

export function tickActiveShocks(persisted: GTELPersisted, turn: number): GTELPersisted {
  const activeShocks = persisted.activeShocks
    .filter(s => turn <= s.endsTurn)
    .map(s => ({
      ...s,
      remainingIntensity: gtelClamp(s.remainingIntensity - 1 / Math.max(1, s.endsTurn - s.startedTurn + 1), 0.15, 1),
    }));
  return { ...persisted, activeShocks };
}

export function scheduledShockIdForTurn(turn: number): string | null {
  if (turn > 0 && turn % 47 === 0) return 'shock_suez_style';
  if (turn > 0 && turn % 53 === 0) return 'shock_iron_crash';
  if (turn > 0 && turn % 61 === 0) return 'shock_lng_spike';
  return null;
}

export function applyScheduledShocks(persisted: GTELPersisted, turn: number): {
  persisted: GTELPersisted;
  newShockIds: string[];
} {
  let next = tickActiveShocks(persisted, turn);
  const newShockIds: string[] = [];
  const id = scheduledShockIdForTurn(turn);
  if (id) {
    const r = activateWorldTradeShock(next, id, turn);
    next = r.persisted;
    if (r.activated) newShockIds.push(id);
  }
  return { persisted: next, newShockIds };
}

export function deriveShockModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  domesticStress: number;
  notes: string[];
  regionIds: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  let domesticStress = 0;
  const notes: string[] = [];
  const regionSet = new Set<string>();

  persisted.activeShocks.forEach(active => {
    const def = getWorldTradeShockDefinition(active.shockId);
    if (!def) return;
    const scale = active.remainingIntensity;
    def.partnerIds.forEach(pid => {
      partnerDeltas[pid] = (partnerDeltas[pid] || 0) + def.partnerAccessDelta * scale;
    });
    Object.entries(def.commodityDeltas).forEach(([c, delta]) => {
      const commodity = c as GTELCommodityId;
      commodityDeltas[commodity] = (commodityDeltas[commodity] || 0) + gtelNum(delta, 0) * scale;
    });
    domesticStress += def.domesticStress * scale;
    def.regionIds.forEach(r => regionSet.add(r));
    notes.push(`${def.title} (${Math.round(scale * 100)}% intensity).`);
  });

  return {
    partnerDeltas,
    commodityDeltas,
    domesticStress: gtelClamp(domesticStress, 0, 0.5),
    notes,
    regionIds: [...regionSet],
  };
}

export function shockWorldEventFromDefinition(def: WorldTradeShockDefinition, turn: number): {
  id: string;
  turn: number;
  kind: 'shock';
  title: string;
  summary: string;
  regionIds: string[];
} {
  return {
    id: `gtel_shock_${def.id}_${turn}`,
    turn,
    kind: 'shock',
    title: def.title,
    summary: def.summary,
    regionIds: def.regionIds,
  };
}
