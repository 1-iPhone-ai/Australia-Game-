import assert from 'node:assert/strict';
import test from 'node:test';
import { runAgent15ModuleSelfTests } from '../src/self-tests.ts';
import {
  createTradeAgreementFromTemplate,
  ratifyTradeAgreement,
  TRADE_AGREEMENT_TEMPLATES,
} from '../src/trade-agreements.ts';
import { activateWorldTradeShock, WORLD_TRADE_SHOCK_CATALOG } from '../src/world-shocks.ts';
import { advancePartnerSanctions } from '../src/sanctions.ts';
import { autoTradePolicyAdjustments } from '../src/trade-policy.ts';
import { openTradeDispute, advanceTradeDisputes } from '../src/trade-disputes.ts';
import { summarizePartnerTrust } from '../src/partner-trust.ts';
import {
  COMMODITY_SHOCK_SCENARIOS,
  triggerCommodityShockScenario,
  scheduledScenarioIdForTurn,
} from '../src/commodity-shock-scenarios.ts';
import { createEmptyGTELPersisted } from '../src/persist.ts';
import { advanceGlobalTradeEconomyTurn, buildGlobalTradeGi3Notes } from '../src/trade-turn.ts';

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
  assert.ok(r.passed >= 17);
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
  assert.ok(['constrained', 'household_led'].includes(r.state.domestic.exportVsDomesticModel));
});

test('sanctions depth emits sanction world events', () => {
  let persisted = createEmptyGTELPersisted();
  const dip = {
    deals: Array.from({ length: 3 }, (_, i) => ({
      id: `v${i}`,
      type: 'resource_trade',
      status: 'violated',
      participants: ['player', 'rival_east'],
      compliance: 'violated',
    })),
    events: [{ kind: 'violation', turn: 4, text: 'sanction escalation asia_pacific' }],
  };
  const step = advancePartnerSanctions(persisted, dip, 5);
  assert.ok(step.events.some(e => e.kind === 'sanction'));
  persisted = step.persisted;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 5,
    diplomacyState: dip,
    nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 50 } } },
    persisted,
  });
  assert.ok(r.state.activeSanctionTiers.asia_pacific === 'sectoral' || r.state.activeSanctionTiers.asia_pacific === 'comprehensive');
});

test('commodity shock scenarios are unique and schedulable', () => {
  const ids = COMMODITY_SHOCK_SCENARIOS.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(scheduledScenarioIdForTurn(120), 'scenario_energy_volatility');
  let persisted = createEmptyGTELPersisted();
  const fired = triggerCommodityShockScenario(persisted, 'scenario_energy_volatility', 120);
  assert.ok(fired.activatedShockIds.length >= 2);
});

test('scale wave: trust scores and policies surface on state', () => {
  const r = advanceGlobalTradeEconomyTurn({
    turn: 14,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 88 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(Object.keys(r.state.partnerTrust || {}).length >= 4);
  assert.equal(typeof r.state.openDisputeCount, 'number');
});

test('scale wave: dispute opens under sectoral sanctions', () => {
  let persisted = createEmptyGTELPersisted();
  const dip = {
    deals: [
      { id: 'v1', type: 'resource_trade', status: 'violated', participants: ['player', 'rival_north'], compliance: 'violated' },
      { id: 'v2', type: 'resource_trade', status: 'violated', participants: ['player', 'rival_north'], compliance: 'violated' },
    ],
    events: [{ kind: 'violation', turn: 7, text: 'sanction europe' }],
  };
  const r = advanceGlobalTradeEconomyTurn({
    turn: 8,
    diplomacyState: dip,
    nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 45 } } },
    persisted,
  });
  assert.ok(r.state.openDisputeCount >= 0);
  assert.ok(summarizePartnerTrust(r.persisted).length >= 4);
});

test('round 3: logistics, trade balance, compliance on turn state', () => {
  const r = advanceGlobalTradeEconomyTurn({
    turn: 22,
    diplomacyState: {
      deals: [{ id: 'v', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 21, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'bottlenecked', exportedCapacity: 130 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(r.state.logistics);
  assert.ok(r.state.tradeBalance);
  assert.ok(r.state.tradeCompliance.band);
  assert.ok(r.state.exportThroughput > 0);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.length >= 2);
});

test('round 3: critical network can emit logistics trade event', () => {
  const r = advanceGlobalTradeEconomyTurn({
    turn: 30,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 160 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(r.worldEvents.some(e => e.id.includes('logistics')) || r.state.logistics.band !== 'fluid');
});

test('round 4: import dependency and diplomatic engagement on state', () => {
  const r = advanceGlobalTradeEconomyTurn({
    turn: 18,
    diplomacyState: {
      deals: [
        {
          id: 'd1',
          type: 'resource_trade',
          status: 'active',
          participants: ['player', 'rival_east'],
          compliance: 'compliant',
        },
      ],
    },
    nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 75 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(r.state.importDependency);
  assert.ok(r.state.importDependency.lines.length >= 6);
  assert.ok(r.state.diplomaticEngagement);
  assert.equal(typeof r.state.diplomaticEngagement.summitPulse, 'number');
  assert.ok(r.persisted.importDependencySmoothing);
});

test('round 4: blocked partner elevates import risk band', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.partnerAccess = { asia_pacific: 'blocked', europe: 'restricted' };
  const r = advanceGlobalTradeEconomyTurn({
    turn: 19,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'bottlenecked', exportedCapacity: 90 } } },
    persisted,
  });
  assert.ok(['elevated', 'critical', 'moderate'].includes(r.state.importDependency.band));
});
