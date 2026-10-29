import type { GTELPersisted } from './types.ts';
import { activateWorldTradeShock, getWorldTradeShockDefinition, WORLD_TRADE_SHOCK_CATALOG } from './world-shocks.ts';

export interface CommodityShockScenario {
  id: string;
  title: string;
  summary: string;
  /** Shock ids activated together (order preserved). */
  shockIds: string[];
  /** Minimum turn before scenario can fire via schedule. */
  minTurn: number;
  regionIds: string[];
}

export const COMMODITY_SHOCK_SCENARIOS: CommodityShockScenario[] = [
  {
    id: 'scenario_bulk_crash',
    title: 'Bulk commodity crash scenario',
    summary: 'Iron and coal indices fall together as Asia–Pacific demand falters.',
    shockIds: ['shock_iron_crash', 'shock_coal_softening'],
    minTurn: 10,
    regionIds: ['WA', 'QLD', 'NSW'],
  },
  {
    id: 'scenario_energy_volatility',
    title: 'Energy export volatility',
    summary: 'LNG spikes while trade finance tightens — mixed household and export signals.',
    shockIds: ['shock_lng_spike', 'shock_financial_contagion'],
    minTurn: 12,
    regionIds: ['WA', 'QLD', 'NSW', 'VIC'],
  },
  {
    id: 'scenario_agri_stress',
    title: 'Agricultural export stress',
    summary: 'Drought-linked wheat weakness and beef market access friction compound.',
    shockIds: ['shock_wheat_drought', 'shock_beef_access'],
    minTurn: 8,
    regionIds: ['NSW', 'VIC', 'SA', 'TAS'],
  },
  {
    id: 'scenario_western_sanctions_spiral',
    title: 'Western market sanctions spiral',
    summary: 'EU embargo plus aluminium retaliation scenario for diplomacy stress tests.',
    shockIds: ['shock_eu_embargo', 'shock_aluminium_retaliation'],
    minTurn: 15,
    regionIds: ['VIC', 'NSW', 'SA'],
  },
];

export function getCommodityShockScenario(id: string): CommodityShockScenario | null {
  return COMMODITY_SHOCK_SCENARIOS.find(s => s.id === id) || null;
}

/** Deterministic scenario schedule (no RNG). */
export function scheduledScenarioIdForTurn(turn: number): string | null {
  if (turn >= 100 && turn % 100 === 0) return 'scenario_bulk_crash';
  if (turn >= 120 && turn % 120 === 0) return 'scenario_energy_volatility';
  if (turn >= 90 && turn % 90 === 0) return 'scenario_agri_stress';
  return null;
}

export function triggerCommodityShockScenario(
  persisted: GTELPersisted,
  scenarioId: string,
  turn: number,
): { persisted: GTELPersisted; activatedShockIds: string[]; scenario: CommodityShockScenario | null } {
  const scenario = getCommodityShockScenario(scenarioId);
  if (!scenario || turn < scenario.minTurn) return { persisted, activatedShockIds: [], scenario: null };
  if ((persisted.firedShockScenarios || []).includes(scenarioId)) {
    return { persisted, activatedShockIds: [], scenario };
  }
  let next = persisted;
  const activatedShockIds: string[] = [];
  scenario.shockIds.forEach(shockId => {
    if (!getWorldTradeShockDefinition(shockId)) return;
    const r = activateWorldTradeShock(next, shockId, turn);
    next = r.persisted;
    if (r.activated) activatedShockIds.push(shockId);
  });
  next = {
    ...next,
    firedShockScenarios: [...(next.firedShockScenarios || []), scenarioId].slice(-16),
  };
  return { persisted: next, activatedShockIds, scenario };
}

export function applyScheduledScenarios(persisted: GTELPersisted, turn: number): {
  persisted: GTELPersisted;
  scenarioIds: string[];
  activatedShockIds: string[];
} {
  const id = scheduledScenarioIdForTurn(turn);
  if (!id) return { persisted, scenarioIds: [], activatedShockIds: [] };
  const r = triggerCommodityShockScenario(persisted, id, turn);
  return {
    persisted: r.persisted,
    scenarioIds: r.scenario ? [id] : [],
    activatedShockIds: r.activatedShockIds,
  };
}

/** Returns shock ids required by scenarios that are missing from the catalog. */
export function validateScenarioShockCatalog(): string[] {
  const ids = WORLD_TRADE_SHOCK_CATALOG.map(s => s.id);
  const required = ['shock_coal_softening', 'shock_wheat_drought', 'shock_beef_access', 'shock_aluminium_retaliation'];
  return required.filter(id => !ids.includes(id));
}
