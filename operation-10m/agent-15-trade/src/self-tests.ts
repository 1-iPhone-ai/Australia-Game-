import { createEmptyGTELPersisted } from './persist.ts';
import {
  createTradeAgreementFromTemplate,
  deriveTradeAgreementModifiers,
  ratifyTradeAgreement,
} from './trade-agreements.ts';
import { advanceGlobalTradeEconomyTurn } from './trade-turn.ts';
import { applyGlobalTradeHouseholdOverrides } from './household-bridge.ts';
import { activateWorldTradeShock, scheduledShockIdForTurn } from './world-shocks.ts';
import { gtelAssert } from './util.ts';

export function runAgent15GlobalTradeLinkageSelfTests(): { passed: number; failed: string[] } {
  const failed: string[] = [];
  let passed = 0;
  const ok = (name: string, fn: () => void) => {
    try {
      fn();
      passed += 1;
    } catch (e: any) {
      failed.push(`${name}: ${e?.message || e}`);
    }
  };

  ok('sanitize empty', () => {
    const p = createEmptyGTELPersisted();
    gtelAssert(p.schemaVersion === 1 && p.revision === 0 && p.agreements.length === 0, 'bad empty persist');
  });

  ok('partner access opens with resource trade deal', () => {
    const dip = {
      deals: [
        {
          id: 'd1',
          type: 'resource_trade',
          status: 'active',
          participants: ['player', 'ai'],
          compliance: 'compliant',
          terms: [{ kind: 'transfer_resource', actorId: 'player', resourceId: 'iron_ore', amount: 2000 }],
        },
      ],
    };
    const r = advanceGlobalTradeEconomyTurn({
      turn: 5,
      diplomacyState: dip,
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 90 } } },
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(r.state.diplomacyTradeDealsActive === 1, 'deal not counted');
    gtelAssert(r.state.commodities.find(c => c.commodity === 'iron_ore')!.effectiveIndex >= 100, 'iron ore below base');
  });

  ok('violations tighten access and emit event', () => {
    const dip = {
      deals: [{ id: 'v1', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 10, text: 'embargo risk' }],
    };
    const r = advanceGlobalTradeEconomyTurn({
      turn: 12,
      diplomacyState: dip,
      nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 40 } } },
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(r.worldEvents.some(e => e.kind === 'diplomacy'), 'expected diplomacy trade event');
    gtelAssert(
      r.state.domestic.exportVsDomesticModel === 'constrained' || r.state.partners.some(p => p.access !== 'strategic'),
      'access should tighten',
    );
  });

  ok('ratified trade agreement boosts partner access', () => {
    const draft = createTradeAgreementFromTemplate('fta_asia_bulk', 8, ['ai']);
    gtelAssert(Boolean(draft), 'template missing');
    const ratified = ratifyTradeAgreement(draft!, 9);
    const persisted = createEmptyGTELPersisted();
    persisted.agreements = [ratified];
    const mods = deriveTradeAgreementModifiers(persisted, 10);
    gtelAssert((mods.partnerDeltas.asia_pacific || 0) > 0, 'expected partner boost');
    const r = advanceGlobalTradeEconomyTurn({
      turn: 10,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 70 } } },
      persisted,
    });
    gtelAssert(r.state.partners.find(p => p.id === 'asia_pacific')!.accessScore > 0.5, 'asia score low');
  });

  ok('world shock reduces iron ore index', () => {
    let persisted = createEmptyGTELPersisted();
    const act = activateWorldTradeShock(persisted, 'shock_iron_crash', 15);
    persisted = act.persisted;
    gtelAssert(Boolean(act.activated), 'shock not activated');
    const r = advanceGlobalTradeEconomyTurn({
      turn: 15,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 80 } } },
      persisted,
    });
    const iron = r.state.commodities.find(c => c.commodity === 'iron_ore')!;
    gtelAssert(iron.shockModifier < 0, 'expected negative shock modifier');
    gtelAssert(r.state.regionalImpacts.some(i => i.regionId === 'WA'), 'WA impact missing');
  });

  ok('scheduled shock is deterministic', () => {
    gtelAssert(scheduledShockIdForTurn(47) === 'shock_suez_style', '47 schedule');
    gtelAssert(scheduledShockIdForTurn(48) === null, '48 should be null');
  });

  ok('household override sets exportSectorBoom', () => {
    const view = advanceGlobalTradeEconomyTurn({
      turn: 20,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'surplus', exportedCapacity: 200 } } },
      persisted: createEmptyGTELPersisted(),
    }).state;
    const out = applyGlobalTradeHouseholdOverrides({ turn: 20, transportNetworkHealth: 70 }, view);
    gtelAssert(typeof out.commodityPrices?.iron_ore === 'number', 'missing commodity price');
    gtelAssert(out.existingIndustryDemandSources?.some((s: string) => s.startsWith('gtel:')), 'missing provenance');
  });

  ok('deterministic hash stable', () => {
    const input = {
      turn: 3,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 55 } } },
      persisted: createEmptyGTELPersisted(),
    };
    const a = advanceGlobalTradeEconomyTurn(input);
    const b = advanceGlobalTradeEconomyTurn(input);
    gtelAssert(a.state.inputHash === b.state.inputHash, 'hash drift');
  });

  return { passed, failed };
}

export function runAgent15ModuleSelfTests(): { passed: number; failed: string[]; total: number } {
  const r = runAgent15GlobalTradeLinkageSelfTests();
  return { ...r, total: r.passed + r.failed.length };
}
