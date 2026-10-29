import assert from 'node:assert/strict';
import test from 'node:test';
import { runAgent15ModuleSelfTests } from '../src/self-tests.ts';
import {
  createTradeAgreementFromTemplate,
  ratifyTradeAgreement,
  TRADE_AGREEMENT_TEMPLATES,
} from '../src/trade-agreements.ts';
import { activateWorldTradeShock, WORLD_TRADE_SHOCK_CATALOG } from '../src/world-shocks.ts';
import { createEmptyGTELPersisted } from '../src/persist.ts';
import { advanceGlobalTradeEconomyTurn } from '../src/trade-turn.ts';

test('trade agreement templates are unique', () => {
  const ids = TRADE_AGREEMENT_TEMPLATES.map(t => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('create and ratify agreement flow', () => {
  const draft = createTradeAgreementFromTemplate('services_eu_mutual', 4, ['rival_north']);
  assert.ok(draft);
  const ratified = ratifyTradeAgreement(draft!, 5);
  assert.equal(ratified.status, 'ratified');
  assert.equal(ratified.ratifiedTurn, 5);
});

test('shock catalog covers major kinds', () => {
  const kinds = new Set(WORLD_TRADE_SHOCK_CATALOG.map(s => s.kind));
  assert.ok(kinds.has('commodity_crash'));
  assert.ok(kinds.has('partner_embargo'));
});

test('integrated self-test bundle passes', () => {
  const r = runAgent15ModuleSelfTests();
  if (r.failed.length) {
    assert.fail(r.failed.join('\n'));
  }
  assert.ok(r.passed >= 8);
});

test('turn 47 schedules shipping shock into persisted state', () => {
  const r = advanceGlobalTradeEconomyTurn({
    turn: 47,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 60 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(r.worldEvents.some(e => e.kind === 'shock'));
  assert.ok(r.persisted.activeShocks.length >= 1);
});

test('manual embargo shock stacks with diplomacy violations', () => {
  let persisted = createEmptyGTELPersisted();
  persisted = activateWorldTradeShock(persisted, 'shock_eu_embargo', 10).persisted;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 11,
    diplomacyState: {
      deals: [{ id: 'x', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 10, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'bottlenecked', exportedCapacity: 20 } } },
    persisted,
  });
  assert.equal(r.state.domestic.exportVsDomesticModel, 'constrained');
});
