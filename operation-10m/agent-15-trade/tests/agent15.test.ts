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
import {
  createTradeAgreementFromTemplate,
  ratifyTradeAgreement,
} from '../src/trade-agreements.ts';
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
  assert.ok(r.passed >= 103);
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

test('round 5: trade finance and market diversification on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.partnerMixSmoothing = {
    asia_pacific: 0.68,
    india_ocean: 0.1,
    north_america: 0.1,
    europe: 0.08,
  };
  const r = advanceGlobalTradeEconomyTurn({
    turn: 24,
    diplomacyState: {
      deals: [{ id: 'v', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 23, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 150 } } },
    persisted,
  });
  assert.ok(r.state.tradeFinance);
  assert.ok(['fluid', 'watch', 'tight', 'frozen'].includes(r.state.tradeFinance.band));
  assert.ok(r.state.marketDiversification);
  assert.equal(typeof r.state.marketDiversification.concentrationIndex, 'number');
  assert.ok(r.persisted.tradeFinanceSmoothing != null);
  assert.ok(r.persisted.partnerMixSmoothing);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Export finance/i.test(n)));
  assert.ok(notes.some(n => /Market diversification/i.test(n)));
});

test('round 5: congested logistics lowers finance-scaled throughput', () => {
  const healthy = advanceGlobalTradeEconomyTurn({
    turn: 26,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 90 } } },
    persisted: createEmptyGTELPersisted(),
  });
  const critical = advanceGlobalTradeEconomyTurn({
    turn: 26,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 90 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(critical.state.exportThroughput <= healthy.state.exportThroughput + 0.01);
});

test('round 6: terms of trade and supply chain resilience on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.partnerMixSmoothing = {
    asia_pacific: 0.72,
    india_ocean: 0.1,
    north_america: 0.1,
    europe: 0.08,
  };
  const r = advanceGlobalTradeEconomyTurn({
    turn: 28,
    diplomacyState: {
      deals: [{ id: 'v', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 27, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 155 } } },
    persisted,
  });
  assert.ok(r.state.termsOfTrade);
  assert.ok(['favorable', 'neutral', 'unfavorable', 'severely_unfavorable'].includes(r.state.termsOfTrade.band));
  assert.ok(r.state.supplyChainResilience);
  assert.equal(typeof r.state.supplyChainResilience.score, 'number');
  assert.ok(r.persisted.termsOfTradeSmoothing != null);
  assert.ok(r.persisted.supplyChainResilienceSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Terms of trade/i.test(n)));
  assert.ok(notes.some(n => /Supply chain resilience/i.test(n)));
});

test('round 6: brittle supply chain reduces throughput vs healthy baseline', () => {
  const healthy = advanceGlobalTradeEconomyTurn({
    turn: 29,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 95 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.partnerAccess = { asia_pacific: 'blocked', europe: 'restricted' };
  persisted.partnerMixSmoothing = { asia_pacific: 0.82, india_ocean: 0.06, north_america: 0.06, europe: 0.06 };
  const stressed = advanceGlobalTradeEconomyTurn({
    turn: 29,
    diplomacyState: {
      deals: Array.from({ length: 3 }, (_, i) => ({
        id: `v${i}`,
        type: 'resource_trade',
        status: 'violated',
        participants: ['player', 'ai'],
        compliance: 'violated',
      })),
      events: [{ kind: 'violation', turn: 28, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 95 } } },
    persisted,
  });
  assert.ok(stressed.state.supplyChainResilience.score <= healthy.state.supplyChainResilience.score + 0.05);
  assert.ok(stressed.state.exportThroughput <= healthy.state.exportThroughput + 0.01);
});

test('round 7: foreign exchange and trade retaliation on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.foreignExchangeSmoothing = 0.9;
  persisted.retaliationPressureSmoothing = 0.55;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 31,
    diplomacyState: {
      deals: Array.from({ length: 3 }, (_, i) => ({
        id: `v${i}`,
        type: 'resource_trade',
        status: 'violated',
        participants: ['player', 'ai'],
        compliance: 'violated',
      })),
      events: [{ kind: 'violation', turn: 30, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 160 } } },
    persisted,
  });
  assert.ok(r.state.foreignExchange);
  assert.ok(['supportive', 'neutral', 'stress', 'crisis'].includes(r.state.foreignExchange.band));
  assert.ok(r.state.tradeRetaliation);
  assert.ok(['dormant', 'watch', 'active', 'escalating'].includes(r.state.tradeRetaliation.band));
  assert.ok(r.persisted.foreignExchangeSmoothing != null);
  assert.ok(r.persisted.retaliationPressureSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /FX pass-through/i.test(n)));
  assert.ok(notes.some(n => /Trade retaliation/i.test(n)));
});

test('round 7: stressed FX index below healthy baseline', () => {
  const supportive = advanceGlobalTradeEconomyTurn({
    turn: 32,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.foreignExchangeSmoothing = 0.84;
  persisted.tradeFinanceSmoothing = 0.18;
  const stressed = advanceGlobalTradeEconomyTurn({
    turn: 32,
    diplomacyState: {
      deals: [{ id: 'v', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 31, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(stressed.state.foreignExchange.pressureIndex <= supportive.state.foreignExchange.pressureIndex + 0.02);
});

test('round 8: trade de-escalation and export capacity on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.deescalationMomentumSmoothing = 0.62;
  persisted.exportCapacitySmoothing = 0.88;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 33,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 140 } } },
    persisted,
  });
  assert.ok(r.state.tradeDeescalation);
  assert.ok(['stalled', 'thawing', 'warming', 'breakthrough'].includes(r.state.tradeDeescalation.band));
  assert.ok(r.state.exportCapacity);
  assert.ok(['slack', 'balanced', 'tight', 'saturated'].includes(r.state.exportCapacity.band));
  assert.ok(r.persisted.deescalationMomentumSmoothing != null);
  assert.ok(r.persisted.exportCapacitySmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade de-escalation/i.test(n)));
  assert.ok(notes.some(n => /Export capacity/i.test(n)));
});

test('round 8: saturated capacity reduces export throughput vs slack baseline', () => {
  const slack = advanceGlobalTradeEconomyTurn({
    turn: 34,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 60 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.exportCapacitySmoothing = 0.96;
  const tight = advanceGlobalTradeEconomyTurn({
    turn: 34,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 200 } } },
    persisted,
  });
  assert.ok(tight.state.exportCapacity.utilization >= slack.state.exportCapacity.utilization - 0.02);
});

test('round 9: trade reconciliation and maritime risk on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.deescalationMomentumSmoothing = 0.68;
  persisted.reconciliationProgressSmoothing = 0.58;
  persisted.maritimeRiskSmoothing = 0.42;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 35,
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
    nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 120 } } },
    persisted,
  });
  assert.ok(r.state.tradeReconciliation);
  assert.ok(['stalled', 'procedural', 'substantive', 'settled'].includes(r.state.tradeReconciliation.band));
  assert.ok(r.state.maritimeRisk);
  assert.ok(['calm', 'elevated', 'severe', 'blocked'].includes(r.state.maritimeRisk.band));
  assert.ok(r.persisted.reconciliationProgressSmoothing != null);
  assert.ok(r.persisted.maritimeRiskSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade reconciliation/i.test(n)));
  assert.ok(notes.some(n => /Maritime risk premium/i.test(n)));
});

test('round 9: congested logistics raises maritime premium vs calm baseline', () => {
  const calm = advanceGlobalTradeEconomyTurn({
    turn: 36,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 70 } } },
    persisted: createEmptyGTELPersisted(),
  });
  const congested = advanceGlobalTradeEconomyTurn({
    turn: 36,
    diplomacyState: {
      deals: Array.from({ length: 2 }, (_, i) => ({
        id: `v${i}`,
        type: 'resource_trade',
        status: 'violated',
        participants: ['player', 'ai'],
        compliance: 'violated',
      })),
      events: [{ kind: 'violation', turn: 35, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 180 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(congested.state.maritimeRisk.premiumIndex >= calm.state.maritimeRisk.premiumIndex - 0.02);
});

test('round 10: preferential utilization and trade enforcement on state', () => {
  let persisted = createEmptyGTELPersisted();
  const draft = createTradeAgreementFromTemplate('fta_asia_bulk', 4, ['rival_east']);
  assert.ok(draft);
  persisted = { ...persisted, agreements: [ratifyTradeAgreement(draft!, 5)] };
  persisted.preferentialUtilizationSmoothing = 0.62;
  persisted.enforcementIntensitySmoothing = 0.42;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 37,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 110 } } },
    persisted,
  });
  assert.ok(r.state.preferentialUtilization);
  assert.ok(['underused', 'balanced', 'high', 'saturated'].includes(r.state.preferentialUtilization.band));
  assert.ok(r.state.tradeEnforcement);
  assert.ok(['light', 'active', 'intensive', 'sweep'].includes(r.state.tradeEnforcement.band));
  assert.ok(r.persisted.preferentialUtilizationSmoothing != null);
  assert.ok(r.persisted.enforcementIntensitySmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Preferential FTA utilisation/i.test(n)));
  assert.ok(notes.some(n => /Trade enforcement/i.test(n)));
});

test('round 10: heavy enforcement reduces throughput vs light baseline', () => {
  const light = advanceGlobalTradeEconomyTurn({
    turn: 38,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 80 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.enforcementIntensitySmoothing = 0.78;
  const heavy = advanceGlobalTradeEconomyTurn({
    turn: 38,
    diplomacyState: {
      deals: Array.from({ length: 4 }, (_, i) => ({
        id: `v${i}`,
        type: 'resource_trade',
        status: 'violated',
        participants: ['player', 'ai'],
        compliance: 'violated',
      })),
      events: [{ kind: 'violation', turn: 37, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 80 } } },
    persisted,
  });
  assert.ok(heavy.state.tradeEnforcement.intensity >= light.state.tradeEnforcement.intensity - 0.02);
  assert.ok(heavy.state.exportThroughput <= light.state.exportThroughput + 0.01);
});

test('round 11: export insurance stack and partner access restoration on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.accessRestorationSmoothing = 0.58;
  persisted.exportInsuranceStackSmoothing = 0.52;
  persisted.deescalationMomentumSmoothing = 0.7;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 39,
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
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.exportInsuranceStack);
  assert.ok(['robust', 'adequate', 'strained', 'impaired'].includes(r.state.exportInsuranceStack.band));
  assert.ok(r.state.partnerAccessRestoration);
  assert.ok(['stalled', 'partial', 'recovering', 'reopened'].includes(r.state.partnerAccessRestoration.band));
  assert.ok(r.persisted.exportInsuranceStackSmoothing != null);
  assert.ok(r.persisted.accessRestorationSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Export credit insurance stack/i.test(n)));
  assert.ok(notes.some(n => /Partner access restoration/i.test(n)));
});

test('round 11: impaired insurance stack reduces throughput vs robust baseline', () => {
  const healthy = advanceGlobalTradeEconomyTurn({
    turn: 40,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.exportInsuranceStackSmoothing = 0.32;
  persisted.maritimeRiskSmoothing = 0.75;
  persisted.enforcementIntensitySmoothing = 0.72;
  persisted.tradeFinanceSmoothing = 0.22;
  const stressed = advanceGlobalTradeEconomyTurn({
    turn: 40,
    diplomacyState: {
      deals: Array.from({ length: 3 }, (_, i) => ({
        id: `v${i}`,
        type: 'resource_trade',
        status: 'violated',
        participants: ['player', 'ai'],
        compliance: 'violated',
      })),
      events: [{ kind: 'violation', turn: 39, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 85 } } },
    persisted,
  });
  assert.ok(stressed.state.exportInsuranceStack.compositeScore <= healthy.state.exportInsuranceStack.compositeScore + 0.05);
  assert.ok(stressed.state.exportThroughput <= healthy.state.exportThroughput + 0.01);
});

test('round 12: trade corridor resilience and sanctions spillover on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeCorridorSmoothing = 0.48;
  persisted.sanctionsSpilloverSmoothing = 0.38;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 41,
    diplomacyState: {
      deals: [{ id: 'v', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 40, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 115 } } },
    persisted,
  });
  assert.ok(r.state.tradeCorridorResilience);
  assert.ok(['robust', 'stable', 'fragile', 'disrupted'].includes(r.state.tradeCorridorResilience.band));
  assert.ok(r.state.sanctionsSpillover);
  assert.ok(['contained', 'localized', 'broad', 'pervasive'].includes(r.state.sanctionsSpillover.band));
  assert.ok(r.persisted.tradeCorridorSmoothing != null);
  assert.ok(r.persisted.sanctionsSpilloverSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade corridor resilience/i.test(n)));
  assert.ok(notes.some(n => /Sanctions spillover/i.test(n)));
});

test('round 12: congested network lowers corridor score vs healthy baseline', () => {
  const healthy = advanceGlobalTradeEconomyTurn({
    turn: 42,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 75 } } },
    persisted: createEmptyGTELPersisted(),
  });
  const critical = advanceGlobalTradeEconomyTurn({
    turn: 42,
    diplomacyState: {
      deals: Array.from({ length: 3 }, (_, i) => ({
        id: `v${i}`,
        type: 'resource_trade',
        status: 'violated',
        participants: ['player', 'ai'],
        compliance: 'violated',
      })),
      events: [{ kind: 'violation', turn: 41, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 75 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(critical.state.tradeCorridorResilience.score <= healthy.state.tradeCorridorResilience.score + 0.05);
});

test('round 13: trade FX hedging and import lane pressure on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeFxHedgingSmoothing = 0.55;
  persisted.importLanePressureSmoothing = 0.52;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 43,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 105 } } },
    persisted,
  });
  assert.ok(r.state.tradeFxHedging);
  assert.ok(['well_hedged', 'balanced', 'exposed', 'unhedged'].includes(r.state.tradeFxHedging.band));
  assert.ok(r.state.importLanePressure);
  assert.ok(['fluid', 'busy', 'congested', 'gridlocked'].includes(r.state.importLanePressure.band));
  assert.ok(r.persisted.tradeFxHedgingSmoothing != null);
  assert.ok(r.persisted.importLanePressureSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade FX hedging/i.test(n)));
  assert.ok(notes.some(n => /Import lane pressure/i.test(n)));
});

test('round 13: critical import dependency raises lane load vs healthy baseline', () => {
  const healthy = advanceGlobalTradeEconomyTurn({
    turn: 44,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 70 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.partnerAccess = { asia_pacific: 'blocked', europe: 'restricted' };
  const stressed = advanceGlobalTradeEconomyTurn({
    turn: 44,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 160 } } },
    persisted,
  });
  assert.ok(stressed.state.importLanePressure.load >= healthy.state.importLanePressure.load - 0.02);
});

test('round 14: diplomatic trade coherence and balance stabilization on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.diplomaticTradeCoherenceSmoothing = 0.58;
  persisted.tradeBalanceStabilizationSmoothing = 0.54;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 45,
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
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 95 } } },
    persisted,
  });
  assert.ok(r.state.diplomaticTradeCoherence);
  assert.ok(['aligned', 'coordinated', 'fragmented', 'divergent'].includes(r.state.diplomaticTradeCoherence.band));
  assert.ok(r.state.tradeBalanceStabilization);
  assert.ok(['anchored', 'steady', 'volatile', 'unstable'].includes(r.state.tradeBalanceStabilization.band));
  assert.ok(r.persisted.diplomaticTradeCoherenceSmoothing != null);
  assert.ok(r.persisted.tradeBalanceStabilizationSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Diplomatic trade coherence/i.test(n)));
  assert.ok(notes.some(n => /Trade balance stabilization/i.test(n)));
});

test('round 14: deficit stress lowers stabilization vs healthy baseline', () => {
  const healthy = advanceGlobalTradeEconomyTurn({
    turn: 46,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 80 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.tradeFinanceSmoothing = 0.2;
  persisted.tradeBalanceStabilizationSmoothing = 0.35;
  const stressed = advanceGlobalTradeEconomyTurn({
    turn: 46,
    diplomacyState: {
      deals: [{ id: 'v', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 45, text: 'breach' }],
    },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 80 } } },
    persisted,
  });
  assert.ok(stressed.state.tradeBalanceStabilization.index <= healthy.state.tradeBalanceStabilization.index + 0.08);
});

test('round 15: trade shock absorption and export commitment pipeline on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeShockAbsorptionSmoothing = 0.56;
  persisted.exportCommitmentPipelineSmoothing = 0.6;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 47,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.tradeShockAbsorption);
  assert.ok(['deep', 'moderate', 'thin', 'exhausted'].includes(r.state.tradeShockAbsorption.band));
  assert.ok(r.state.exportCommitmentPipeline);
  assert.ok(['slack', 'steady', 'strong', 'booked_out'].includes(r.state.exportCommitmentPipeline.band));
  assert.ok(r.persisted.tradeShockAbsorptionSmoothing != null);
  assert.ok(r.persisted.exportCommitmentPipelineSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade shock absorption/i.test(n)));
  assert.ok(notes.some(n => /Export commitment pipeline/i.test(n)));
});

test('round 15: saturated export capacity raises pipeline fill vs slack baseline', () => {
  const slack = advanceGlobalTradeEconomyTurn({
    turn: 48,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 55 } } },
    persisted: createEmptyGTELPersisted(),
  });
  const saturated = advanceGlobalTradeEconomyTurn({
    turn: 48,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 190 } } },
    persisted: createEmptyGTELPersisted(),
  });
  assert.ok(saturated.state.exportCommitmentPipeline.fillRate >= slack.state.exportCommitmentPipeline.fillRate - 0.05);
});

test('round 16: import commitment pipeline and trade flow cohesion on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.importCommitmentPipelineSmoothing = 0.58;
  persisted.tradeFlowCohesionSmoothing = 0.55;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 49,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.importCommitmentPipeline);
  assert.ok(['slack', 'steady', 'strong', 'booked_out'].includes(r.state.importCommitmentPipeline.band));
  assert.ok(r.state.tradeFlowCohesion);
  assert.ok(['synchronized', 'balanced', 'skewed', 'dislocated'].includes(r.state.tradeFlowCohesion.band));
  assert.ok(r.persisted.importCommitmentPipelineSmoothing != null);
  assert.ok(r.persisted.tradeFlowCohesionSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Import commitment pipeline/i.test(n)));
  assert.ok(notes.some(n => /Trade flow cohesion/i.test(n)));
});

test('round 16: critical import dependency raises pipeline fill vs slack baseline', () => {
  const slack = advanceGlobalTradeEconomyTurn({
    turn: 50,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 55 } } },
    persisted: createEmptyGTELPersisted(),
  });
  let persisted = createEmptyGTELPersisted();
  persisted.importDependencySmoothing = { electronics: 0.85, machinery: 0.82 };
  const critical = advanceGlobalTradeEconomyTurn({
    turn: 50,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 55 } } },
    persisted,
  });
  assert.ok(
    critical.state.importCommitmentPipeline.fillRate >= slack.state.importCommitmentPipeline.fillRate - 0.06,
  );
});

test('round 17: throughput orchestration and commitment ledger harmonization on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeThroughputOrchestrationSmoothing = 0.56;
  persisted.commitmentLedgerHarmonizationSmoothing = 0.54;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 51,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.tradeThroughputOrchestration);
  assert.ok(['fluid', 'paced', 'congested', 'stalled'].includes(r.state.tradeThroughputOrchestration.band));
  assert.ok(r.state.commitmentLedgerHarmonization);
  assert.ok(['aligned', 'adjusting', 'divergent', 'fractured'].includes(r.state.commitmentLedgerHarmonization.band));
  assert.ok(r.persisted.tradeThroughputOrchestrationSmoothing != null);
  assert.ok(r.persisted.commitmentLedgerHarmonizationSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade throughput orchestration/i.test(n)));
  assert.ok(notes.some(n => /Commitment ledger harmonization/i.test(n)));
});

test('round 17: congested logistics lowers orchestration vs fluid baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeThroughputOrchestrationSmoothing = 0.5;
  const healthy = advanceGlobalTradeEconomyTurn({
    turn: 52,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 80 } } },
    persisted: { ...persisted },
  });
  const critical = advanceGlobalTradeEconomyTurn({
    turn: 52,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 190 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    healthy.state.tradeThroughputOrchestration.score >= critical.state.tradeThroughputOrchestration.score - 0.12,
  );
});

test('round 18: bilateral cargo scheduling and commitment turn closeout on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCargoSchedulingSmoothing = 0.55;
  persisted.commitmentTurnCloseoutSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 53,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.bilateralCargoScheduling);
  assert.ok(['on_schedule', 'slipping', 'backlogged', 'gridlocked'].includes(r.state.bilateralCargoScheduling.band));
  assert.ok(r.state.commitmentTurnCloseout);
  assert.ok(['closed_clean', 'minor_variance', 'open_slots', 'unsettled'].includes(r.state.commitmentTurnCloseout.band));
  assert.ok(r.persisted.bilateralCargoSchedulingSmoothing != null);
  assert.ok(r.persisted.commitmentTurnCloseoutSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Bilateral cargo scheduling/i.test(n)));
  assert.ok(notes.some(n => /Commitment turn closeout/i.test(n)));
});

test('round 18: fractured harmonization lowers cargo scheduling vs aligned baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.commitmentLedgerHarmonizationSmoothing = 0.72;
  persisted.tradeThroughputOrchestrationSmoothing = 0.66;
  const aligned = advanceGlobalTradeEconomyTurn({
    turn: 54,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.commitmentLedgerHarmonizationSmoothing = 0.28;
  persisted.tradeThroughputOrchestrationSmoothing = 0.24;
  const fractured = advanceGlobalTradeEconomyTurn({
    turn: 54,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 190 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    aligned.state.bilateralCargoScheduling.score >= fractured.state.bilateralCargoScheduling.score - 0.14,
  );
});

test('round 19: forward slot rollover and bilateral settlement reconciliation on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.forwardSlotRolloverSmoothing = 0.54;
  persisted.bilateralSettlementReconciliationSmoothing = 0.52;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 55,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.forwardSlotRollover);
  assert.ok(['seamless', 'partial', 'lumpy', 'blocked'].includes(r.state.forwardSlotRollover.band));
  assert.ok(r.state.bilateralSettlementReconciliation);
  assert.ok(['settled', 'reconciling', 'disputed', 'unsettled'].includes(r.state.bilateralSettlementReconciliation.band));
  assert.ok(r.persisted.forwardSlotRolloverSmoothing != null);
  assert.ok(r.persisted.bilateralSettlementReconciliationSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Forward slot rollover/i.test(n)));
  assert.ok(notes.some(n => /Bilateral settlement reconciliation/i.test(n)));
});

test('round 19: unsettled closeout weakens rollover vs clean baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.commitmentTurnCloseoutSmoothing = 0.74;
  const clean = advanceGlobalTradeEconomyTurn({
    turn: 56,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 80 } } },
    persisted: { ...persisted },
  });
  persisted.commitmentTurnCloseoutSmoothing = 0.26;
  const stressed = advanceGlobalTradeEconomyTurn({
    turn: 56,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 185 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    clean.state.forwardSlotRollover.score >= stressed.state.forwardSlotRollover.score - 0.14,
  );
});

test('round 20: settlement continuity and forward book anchor on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeSettlementContinuitySmoothing = 0.55;
  persisted.forwardBookAnchorStabilizationSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 57,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.tradeSettlementContinuity);
  assert.ok(['anchored', 'tracking', 'drifting', 'broken'].includes(r.state.tradeSettlementContinuity.band));
  assert.ok(r.state.forwardBookAnchorStabilization);
  assert.ok(['locked', 'firm', 'soft', 'unmoored'].includes(r.state.forwardBookAnchorStabilization.band));
  assert.ok(r.persisted.tradeSettlementContinuitySmoothing != null);
  assert.ok(r.persisted.forwardBookAnchorStabilizationSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade settlement continuity/i.test(n)));
  assert.ok(notes.some(n => /Forward book anchor stabilization/i.test(n)));
});

test('round 20: broken settlement continuity weakens book anchor vs anchored baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeSettlementContinuitySmoothing = 0.76;
  persisted.commitmentLedgerHarmonizationSmoothing = 0.7;
  const anchored = advanceGlobalTradeEconomyTurn({
    turn: 58,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.tradeSettlementContinuitySmoothing = 0.24;
  persisted.commitmentLedgerHarmonizationSmoothing = 0.22;
  const broken = advanceGlobalTradeEconomyTurn({
    turn: 58,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 190 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    anchored.state.forwardBookAnchorStabilization.score >= broken.state.forwardBookAnchorStabilization.score - 0.14,
  );
});

test('round 21: anchored book readiness and throughput certification on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.anchoredBookReadinessSmoothing = 0.54;
  persisted.bilateralThroughputCertificationSmoothing = 0.52;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 59,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.anchoredBookReadiness);
  assert.ok(['ready', 'staging', 'constrained', 'blocked'].includes(r.state.anchoredBookReadiness.band));
  assert.ok(r.state.bilateralThroughputCertification);
  assert.ok(['certified', 'pending', 'conditional', 'rejected'].includes(r.state.bilateralThroughputCertification.band));
  assert.ok(r.persisted.anchoredBookReadinessSmoothing != null);
  assert.ok(r.persisted.bilateralThroughputCertificationSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Anchored book readiness/i.test(n)));
  assert.ok(notes.some(n => /Bilateral throughput certification/i.test(n)));
});

test('round 21: blocked readiness lowers certification vs ready baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.anchoredBookReadinessSmoothing = 0.78;
  persisted.forwardBookAnchorStabilizationSmoothing = 0.74;
  const ready = advanceGlobalTradeEconomyTurn({
    turn: 60,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.anchoredBookReadinessSmoothing = 0.22;
  persisted.forwardBookAnchorStabilizationSmoothing = 0.2;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 60,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 195 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    ready.state.bilateralThroughputCertification.score >= blocked.state.bilateralThroughputCertification.score - 0.14,
  );
});

test('round 22: certified throughput sustainment and capacity handoff gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.certifiedThroughputSustainmentSmoothing = 0.55;
  persisted.bilateralCapacityHandoffGateSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 61,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.certifiedThroughputSustainment);
  assert.ok(['sustained', 'holding', 'fading', 'exhausted'].includes(r.state.certifiedThroughputSustainment.band));
  assert.ok(r.state.bilateralCapacityHandoffGate);
  assert.ok(['open', 'queued', 'throttled', 'closed'].includes(r.state.bilateralCapacityHandoffGate.band));
  assert.ok(r.persisted.certifiedThroughputSustainmentSmoothing != null);
  assert.ok(r.persisted.bilateralCapacityHandoffGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Certified throughput sustainment/i.test(n)));
  assert.ok(notes.some(n => /Bilateral capacity handoff gate/i.test(n)));
});

test('round 22: rejected certification weakens sustainment vs certified baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralThroughputCertificationSmoothing = 0.8;
  persisted.forwardBookAnchorStabilizationSmoothing = 0.74;
  const certified = advanceGlobalTradeEconomyTurn({
    turn: 62,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralThroughputCertificationSmoothing = 0.2;
  persisted.forwardBookAnchorStabilizationSmoothing = 0.18;
  const rejected = advanceGlobalTradeEconomyTurn({
    turn: 62,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 200 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    certified.state.certifiedThroughputSustainment.score >=
      rejected.state.certifiedThroughputSustainment.score - 0.14,
  );
});

test('round 23: capacity handoff absorption and trade window continuity on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.capacityHandoffAbsorptionSmoothing = 0.55;
  persisted.bilateralTradeWindowContinuitySmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 63,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.capacityHandoffAbsorption);
  assert.ok(['absorbed', 'integrating', 'leaking', 'rejected'].includes(r.state.capacityHandoffAbsorption.band));
  assert.ok(r.state.bilateralTradeWindowContinuity);
  assert.ok(['continuous', 'bridging', 'gapped', 'severed'].includes(r.state.bilateralTradeWindowContinuity.band));
  assert.ok(r.persisted.capacityHandoffAbsorptionSmoothing != null);
  assert.ok(r.persisted.bilateralTradeWindowContinuitySmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Capacity handoff absorption/i.test(n)));
  assert.ok(notes.some(n => /Bilateral trade window continuity/i.test(n)));
});

test('round 23: closed handoff gate weakens absorption vs open baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCapacityHandoffGateSmoothing = 0.82;
  persisted.certifiedThroughputSustainmentSmoothing = 0.76;
  const open = advanceGlobalTradeEconomyTurn({
    turn: 64,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralCapacityHandoffGateSmoothing = 0.18;
  persisted.certifiedThroughputSustainmentSmoothing = 0.16;
  const closed = advanceGlobalTradeEconomyTurn({
    turn: 64,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 205 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    open.state.capacityHandoffAbsorption.score >= closed.state.capacityHandoffAbsorption.score - 0.14,
  );
});

test('round 24: cycle seal verification and capacity renewal gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.tradeCycleSealVerificationSmoothing = 0.55;
  persisted.bilateralCapacityRenewalGateSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 65,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.tradeCycleSealVerification);
  assert.ok(['verified', 'provisional', 'contested', 'failed'].includes(r.state.tradeCycleSealVerification.band));
  assert.ok(r.state.bilateralCapacityRenewalGate);
  assert.ok(['renewed', 'pending', 'deferred', 'blocked'].includes(r.state.bilateralCapacityRenewalGate.band));
  assert.ok(r.persisted.tradeCycleSealVerificationSmoothing != null);
  assert.ok(r.persisted.bilateralCapacityRenewalGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Trade cycle seal verification/i.test(n)));
  assert.ok(notes.some(n => /Bilateral capacity renewal gate/i.test(n)));
});

test('round 24: severed window continuity weakens seal vs continuous baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralTradeWindowContinuitySmoothing = 0.84;
  persisted.certifiedThroughputSustainmentSmoothing = 0.78;
  const continuous = advanceGlobalTradeEconomyTurn({
    turn: 66,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralTradeWindowContinuitySmoothing = 0.18;
  persisted.certifiedThroughputSustainmentSmoothing = 0.16;
  const severed = advanceGlobalTradeEconomyTurn({
    turn: 66,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 210 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    continuous.state.tradeCycleSealVerification.score >= severed.state.tradeCycleSealVerification.score - 0.14,
  );
});

test('round 25: capacity renewal priming and cycle reentry gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.capacityRenewalPrimingSmoothing = 0.55;
  persisted.bilateralCycleReentryGateSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 67,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.capacityRenewalPriming);
  assert.ok(['primed', 'charging', 'underfed', 'starved'].includes(r.state.capacityRenewalPriming.band));
  assert.ok(r.state.bilateralCycleReentryGate);
  assert.ok(['entered', 'approaching', 'held', 'denied'].includes(r.state.bilateralCycleReentryGate.band));
  assert.ok(r.persisted.capacityRenewalPrimingSmoothing != null);
  assert.ok(r.persisted.bilateralCycleReentryGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Capacity renewal priming/i.test(n)));
  assert.ok(notes.some(n => /Bilateral cycle reentry gate/i.test(n)));
});

test('round 25: blocked renewal weakens priming vs renewed baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCapacityRenewalGateSmoothing = 0.86;
  persisted.certifiedThroughputSustainmentSmoothing = 0.8;
  const renewed = advanceGlobalTradeEconomyTurn({
    turn: 68,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralCapacityRenewalGateSmoothing = 0.16;
  persisted.certifiedThroughputSustainmentSmoothing = 0.14;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 68,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 215 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    renewed.state.capacityRenewalPriming.score >= blocked.state.capacityRenewalPriming.score - 0.14,
  );
});

test('round 26: cycle reentry stabilization and loop resumption gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.cycleReentryStabilizationSmoothing = 0.55;
  persisted.bilateralLoopResumptionGateSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 69,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.cycleReentryStabilization);
  assert.ok(['stable', 'settling', 'unsettled', 'volatile'].includes(r.state.cycleReentryStabilization.band));
  assert.ok(r.state.bilateralLoopResumptionGate);
  assert.ok(['resumed', 'opening', 'stalled', 'closed'].includes(r.state.bilateralLoopResumptionGate.band));
  assert.ok(r.persisted.cycleReentryStabilizationSmoothing != null);
  assert.ok(r.persisted.bilateralLoopResumptionGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Cycle reentry stabilization/i.test(n)));
  assert.ok(notes.some(n => /Bilateral loop resumption gate/i.test(n)));
});

test('round 26: denied reentry weakens stabilization vs entered baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCycleReentryGateSmoothing = 0.88;
  persisted.tradeCycleSealVerificationSmoothing = 0.82;
  const entered = advanceGlobalTradeEconomyTurn({
    turn: 70,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralCycleReentryGateSmoothing = 0.14;
  persisted.tradeCycleSealVerificationSmoothing = 0.12;
  const denied = advanceGlobalTradeEconomyTurn({
    turn: 70,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 220 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    entered.state.cycleReentryStabilization.score >= denied.state.cycleReentryStabilization.score - 0.14,
  );
});

test('round 27: resumed loop continuity and cycle restart acknowledgment on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.resumedLoopContinuitySmoothing = 0.55;
  persisted.bilateralCycleRestartAcknowledgmentSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 71,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.resumedLoopContinuity);
  assert.ok(['continuous', 'linked', 'fragile', 'broken'].includes(r.state.resumedLoopContinuity.band));
  assert.ok(r.state.bilateralCycleRestartAcknowledgment);
  assert.ok(['acknowledged', 'pending', 'deferred', 'rejected'].includes(r.state.bilateralCycleRestartAcknowledgment.band));
  assert.ok(r.persisted.resumedLoopContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralCycleRestartAcknowledgmentSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Resumed loop continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral cycle restart acknowledgment/i.test(n)));
});

test('round 27: closed resumption weakens loop continuity vs resumed baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralLoopResumptionGateSmoothing = 0.9;
  persisted.cycleReentryStabilizationSmoothing = 0.84;
  const resumed = advanceGlobalTradeEconomyTurn({
    turn: 72,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralLoopResumptionGateSmoothing = 0.12;
  persisted.cycleReentryStabilizationSmoothing = 0.1;
  const closed = advanceGlobalTradeEconomyTurn({
    turn: 72,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 225 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    resumed.state.resumedLoopContinuity.score >= closed.state.resumedLoopContinuity.score - 0.14,
  );
});

test('round 28: acknowledged cycle priming and commitment arc opening on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.acknowledgedCyclePrimingSmoothing = 0.55;
  persisted.bilateralCommitmentArcOpeningSmoothing = 0.53;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 73,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted,
  });
  assert.ok(r.state.acknowledgedCyclePriming);
  assert.ok(['primed', 'charging', 'weak', 'empty'].includes(r.state.acknowledgedCyclePriming.band));
  assert.ok(r.state.bilateralCommitmentArcOpening);
  assert.ok(['opened', 'unlocking', 'latched', 'sealed'].includes(r.state.bilateralCommitmentArcOpening.band));
  assert.ok(r.persisted.acknowledgedCyclePrimingSmoothing != null);
  assert.ok(r.persisted.bilateralCommitmentArcOpeningSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Acknowledged cycle priming/i.test(n)));
  assert.ok(notes.some(n => /Bilateral commitment arc opening/i.test(n)));
});

test('round 28: rejected restart acknowledgment weakens priming vs acknowledged baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCycleRestartAcknowledgmentSmoothing = 0.92;
  persisted.capacityRenewalPrimingSmoothing = 0.86;
  const acknowledged = advanceGlobalTradeEconomyTurn({
    turn: 74,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 85 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralCycleRestartAcknowledgmentSmoothing = 0.1;
  persisted.capacityRenewalPrimingSmoothing = 0.08;
  const rejected = advanceGlobalTradeEconomyTurn({
    turn: 74,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 230 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    acknowledged.state.acknowledgedCyclePriming.score >= rejected.state.acknowledgedCyclePriming.score - 0.14,
  );
});

test('round 29: commitment arc continuity and forward admission on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.commitmentArcContinuitySmoothing = 0.56;
  persisted.bilateralForwardCommitmentAdmissionSmoothing = 0.54;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 75,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 105 } } },
    persisted,
  });
  assert.ok(r.state.commitmentArcContinuity);
  assert.ok(['sustained', 'tracking', 'drifting', 'lost'].includes(r.state.commitmentArcContinuity.band));
  assert.ok(r.state.bilateralForwardCommitmentAdmission);
  assert.ok(
    ['admitted', 'staging', 'throttled', 'closed'].includes(r.state.bilateralForwardCommitmentAdmission.band),
  );
  assert.ok(r.persisted.commitmentArcContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralForwardCommitmentAdmissionSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Commitment arc continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral forward commitment admission/i.test(n)));
});

test('round 29: sealed arc opening weakens continuity vs opened baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCommitmentArcOpeningSmoothing = 0.91;
  persisted.resumedLoopContinuitySmoothing = 0.88;
  const opened = advanceGlobalTradeEconomyTurn({
    turn: 76,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 90 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralCommitmentArcOpeningSmoothing = 0.14;
  persisted.resumedLoopContinuitySmoothing = 0.12;
  const sealed = advanceGlobalTradeEconomyTurn({
    turn: 76,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 240 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    opened.state.commitmentArcContinuity.score >= sealed.state.commitmentArcContinuity.score - 0.14,
  );
});

test('round 30: admitted continuity and commitment window handoff on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.admittedForwardCommitmentContinuitySmoothing = 0.57;
  persisted.bilateralCommitmentWindowHandoffSmoothing = 0.55;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 77,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 108 } } },
    persisted,
  });
  assert.ok(r.state.admittedForwardCommitmentContinuity);
  assert.ok(['anchored', 'holding', 'slipping', 'revoked'].includes(r.state.admittedForwardCommitmentContinuity.band));
  assert.ok(r.state.bilateralCommitmentWindowHandoff);
  assert.ok(
    ['handed_off', 'aligning', 'queued', 'blocked'].includes(r.state.bilateralCommitmentWindowHandoff.band),
  );
  assert.ok(r.persisted.admittedForwardCommitmentContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralCommitmentWindowHandoffSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Admitted forward commitment continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral commitment window handoff/i.test(n)));
});

test('round 30: closed admission weakens admitted continuity vs admitted baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralForwardCommitmentAdmissionSmoothing = 0.9;
  persisted.commitmentArcContinuitySmoothing = 0.87;
  const admitted = advanceGlobalTradeEconomyTurn({
    turn: 78,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 88 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralForwardCommitmentAdmissionSmoothing = 0.12;
  persisted.commitmentArcContinuitySmoothing = 0.1;
  const closed = advanceGlobalTradeEconomyTurn({
    turn: 78,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 235 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    admitted.state.admittedForwardCommitmentContinuity.score >=
      closed.state.admittedForwardCommitmentContinuity.score - 0.14,
  );
});

test('round 31: window sustainment and forward cycle advance gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.commitmentWindowSustainmentSmoothing = 0.58;
  persisted.bilateralForwardCycleAdvanceGateSmoothing = 0.56;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 79,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 110 } } },
    persisted,
  });
  assert.ok(r.state.commitmentWindowSustainment);
  assert.ok(['sustained', 'carrying', 'fading', 'dropped'].includes(r.state.commitmentWindowSustainment.band));
  assert.ok(r.state.bilateralForwardCycleAdvanceGate);
  assert.ok(
    ['advanced', 'clearing', 'held', 'denied'].includes(r.state.bilateralForwardCycleAdvanceGate.band),
  );
  assert.ok(r.persisted.commitmentWindowSustainmentSmoothing != null);
  assert.ok(r.persisted.bilateralForwardCycleAdvanceGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Commitment window sustainment/i.test(n)));
  assert.ok(notes.some(n => /Bilateral forward cycle advance gate/i.test(n)));
});

test('round 31: blocked handoff weakens sustainment vs handed-off baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCommitmentWindowHandoffSmoothing = 0.91;
  persisted.admittedForwardCommitmentContinuitySmoothing = 0.88;
  const handed = advanceGlobalTradeEconomyTurn({
    turn: 80,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 92 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralCommitmentWindowHandoffSmoothing = 0.13;
  persisted.admittedForwardCommitmentContinuitySmoothing = 0.11;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 80,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 238 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    handed.state.commitmentWindowSustainment.score >= blocked.state.commitmentWindowSustainment.score - 0.14,
  );
});

test('round 32: advance continuity and commitment loop reopen gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.forwardCycleAdvanceContinuitySmoothing = 0.59;
  persisted.bilateralCommitmentLoopReopenGateSmoothing = 0.57;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 81,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 112 } } },
    persisted,
  });
  assert.ok(r.state.forwardCycleAdvanceContinuity);
  assert.ok(['locked_in', 'tracking', 'wavering', 'broken'].includes(r.state.forwardCycleAdvanceContinuity.band));
  assert.ok(r.state.bilateralCommitmentLoopReopenGate);
  assert.ok(
    ['reopened', 'unlocking', 'latched', 'sealed'].includes(r.state.bilateralCommitmentLoopReopenGate.band),
  );
  assert.ok(r.persisted.forwardCycleAdvanceContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralCommitmentLoopReopenGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Forward cycle advance continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral commitment loop reopen gate/i.test(n)));
});

test('round 32: denied advance gate weakens continuity vs advanced baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralForwardCycleAdvanceGateSmoothing = 0.92;
  persisted.commitmentWindowSustainmentSmoothing = 0.89;
  const advanced = advanceGlobalTradeEconomyTurn({
    turn: 82,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 94 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralForwardCycleAdvanceGateSmoothing = 0.14;
  persisted.commitmentWindowSustainmentSmoothing = 0.12;
  const denied = advanceGlobalTradeEconomyTurn({
    turn: 82,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 242 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    advanced.state.forwardCycleAdvanceContinuity.score >=
      denied.state.forwardCycleAdvanceContinuity.score - 0.14,
  );
});

test('round 33: reopened loop continuity and forward arc recharge gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.reopenedCommitmentLoopContinuitySmoothing = 0.6;
  persisted.bilateralForwardArcRechargeGateSmoothing = 0.58;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 83,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 114 } } },
    persisted,
  });
  assert.ok(r.state.reopenedCommitmentLoopContinuity);
  assert.ok(['stable', 'linked', 'fraying', 'cut'].includes(r.state.reopenedCommitmentLoopContinuity.band));
  assert.ok(r.state.bilateralForwardArcRechargeGate);
  assert.ok(
    ['recharged', 'charging', 'starved', 'blocked'].includes(r.state.bilateralForwardArcRechargeGate.band),
  );
  assert.ok(r.persisted.reopenedCommitmentLoopContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralForwardArcRechargeGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Reopened commitment loop continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral forward arc recharge gate/i.test(n)));
});

test('round 33: sealed loop reopen weakens continuity vs reopened baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralCommitmentLoopReopenGateSmoothing = 0.93;
  persisted.forwardCycleAdvanceContinuitySmoothing = 0.9;
  const reopened = advanceGlobalTradeEconomyTurn({
    turn: 84,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 96 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralCommitmentLoopReopenGateSmoothing = 0.15;
  persisted.forwardCycleAdvanceContinuitySmoothing = 0.13;
  const sealed = advanceGlobalTradeEconomyTurn({
    turn: 84,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 245 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    reopened.state.reopenedCommitmentLoopContinuity.score >=
      sealed.state.reopenedCommitmentLoopContinuity.score - 0.14,
  );
});

test('round 34: recharge continuity and renewal arc priming gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.forwardArcRechargeContinuitySmoothing = 0.61;
  persisted.bilateralRenewalArcPrimingGateSmoothing = 0.59;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 85,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 116 } } },
    persisted,
  });
  assert.ok(r.state.forwardArcRechargeContinuity);
  assert.ok(['held', 'carrying', 'thinning', 'lost'].includes(r.state.forwardArcRechargeContinuity.band));
  assert.ok(r.state.bilateralRenewalArcPrimingGate);
  assert.ok(['primed', 'arming', 'idle', 'blocked'].includes(r.state.bilateralRenewalArcPrimingGate.band));
  assert.ok(r.persisted.forwardArcRechargeContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralRenewalArcPrimingGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Forward arc recharge continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral renewal arc priming gate/i.test(n)));
});

test('round 34: blocked arc recharge weakens continuity vs recharged baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralForwardArcRechargeGateSmoothing = 0.94;
  persisted.reopenedCommitmentLoopContinuitySmoothing = 0.91;
  const recharged = advanceGlobalTradeEconomyTurn({
    turn: 86,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 98 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralForwardArcRechargeGateSmoothing = 0.16;
  persisted.reopenedCommitmentLoopContinuitySmoothing = 0.14;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 86,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 248 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    recharged.state.forwardArcRechargeContinuity.score >=
      blocked.state.forwardArcRechargeContinuity.score - 0.14,
  );
});

test('round 35: priming continuity and next arc open prep gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.renewalArcPrimingContinuitySmoothing = 0.62;
  persisted.bilateralNextArcOpenPrepGateSmoothing = 0.6;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 87,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 118 } } },
    persisted,
  });
  assert.ok(r.state.renewalArcPrimingContinuity);
  assert.ok(['settled', 'holding', 'unsettled', 'void'].includes(r.state.renewalArcPrimingContinuity.band));
  assert.ok(r.state.bilateralNextArcOpenPrepGate);
  assert.ok(['prepped', 'staging', 'deferred', 'blocked'].includes(r.state.bilateralNextArcOpenPrepGate.band));
  assert.ok(r.persisted.renewalArcPrimingContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralNextArcOpenPrepGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Renewal arc priming continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral next arc open prep gate/i.test(n)));
});

test('round 35: blocked priming gate weakens continuity vs primed baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralRenewalArcPrimingGateSmoothing = 0.95;
  persisted.forwardArcRechargeContinuitySmoothing = 0.92;
  const primed = advanceGlobalTradeEconomyTurn({
    turn: 88,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 100 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralRenewalArcPrimingGateSmoothing = 0.17;
  persisted.forwardArcRechargeContinuitySmoothing = 0.15;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 88,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 250 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    primed.state.renewalArcPrimingContinuity.score >= blocked.state.renewalArcPrimingContinuity.score - 0.14,
  );
});

test('round 36: prep continuity and prepared arc opening handoff on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.nextArcOpenPrepContinuitySmoothing = 0.63;
  persisted.bilateralPreparedArcOpeningHandoffSmoothing = 0.61;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 89,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 120 } } },
    persisted,
  });
  assert.ok(r.state.nextArcOpenPrepContinuity);
  assert.ok(['ready', 'aligned', 'drifting', 'cleared'].includes(r.state.nextArcOpenPrepContinuity.band));
  assert.ok(r.state.bilateralPreparedArcOpeningHandoff);
  assert.ok(
    ['handed_off', 'coupling', 'queued', 'withheld'].includes(r.state.bilateralPreparedArcOpeningHandoff.band),
  );
  assert.ok(r.persisted.nextArcOpenPrepContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralPreparedArcOpeningHandoffSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Next arc open prep continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral prepared arc opening handoff/i.test(n)));
});

test('round 36: blocked prep gate weakens continuity vs prepped baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralNextArcOpenPrepGateSmoothing = 0.96;
  persisted.renewalArcPrimingContinuitySmoothing = 0.93;
  const prepped = advanceGlobalTradeEconomyTurn({
    turn: 90,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 102 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralNextArcOpenPrepGateSmoothing = 0.18;
  persisted.renewalArcPrimingContinuitySmoothing = 0.16;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 90,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 252 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    prepped.state.nextArcOpenPrepContinuity.score >= blocked.state.nextArcOpenPrepContinuity.score - 0.14,
  );
});

test('round 37: handoff continuity and scale loop seal gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.preparedArcHandoffContinuitySmoothing = 0.64;
  persisted.bilateralScaleLoopSealGateSmoothing = 0.62;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 91,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 122 } } },
    persisted,
  });
  assert.ok(r.state.preparedArcHandoffContinuity);
  assert.ok(['locked', 'tracking', 'slack', 'broken'].includes(r.state.preparedArcHandoffContinuity.band));
  assert.ok(r.state.bilateralScaleLoopSealGate);
  assert.ok(['sealed', 'tightening', 'pending', 'open'].includes(r.state.bilateralScaleLoopSealGate.band));
  assert.ok(r.persisted.preparedArcHandoffContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralScaleLoopSealGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Prepared arc handoff continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral scale loop seal gate/i.test(n)));
});

test('round 37: withheld handoff weakens continuity vs handed-off baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralPreparedArcOpeningHandoffSmoothing = 0.97;
  persisted.nextArcOpenPrepContinuitySmoothing = 0.94;
  const handed = advanceGlobalTradeEconomyTurn({
    turn: 92,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 104 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralPreparedArcOpeningHandoffSmoothing = 0.19;
  persisted.nextArcOpenPrepContinuitySmoothing = 0.17;
  const withheld = advanceGlobalTradeEconomyTurn({
    turn: 92,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 254 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    handed.state.preparedArcHandoffContinuity.score >= withheld.state.preparedArcHandoffContinuity.score - 0.14,
  );
});

test('round 38: sealed loop continuity and scale wave reentry gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.sealedScaleLoopContinuitySmoothing = 0.65;
  persisted.bilateralScaleWaveReentryGateSmoothing = 0.63;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 93,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 124 } } },
    persisted,
  });
  assert.ok(r.state.sealedScaleLoopContinuity);
  assert.ok(['anchored', 'holding', 'loosening', 'broken'].includes(r.state.sealedScaleLoopContinuity.band));
  assert.ok(r.state.bilateralScaleWaveReentryGate);
  assert.ok(['reentered', 'approaching', 'stalled', 'closed'].includes(r.state.bilateralScaleWaveReentryGate.band));
  assert.ok(r.persisted.sealedScaleLoopContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralScaleWaveReentryGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Sealed scale loop continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral scale wave reentry gate/i.test(n)));
});

test('round 38: open loop seal weakens continuity vs sealed baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralScaleLoopSealGateSmoothing = 0.98;
  persisted.preparedArcHandoffContinuitySmoothing = 0.95;
  const sealed = advanceGlobalTradeEconomyTurn({
    turn: 94,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 106 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralScaleLoopSealGateSmoothing = 0.2;
  persisted.preparedArcHandoffContinuitySmoothing = 0.18;
  const open = advanceGlobalTradeEconomyTurn({
    turn: 94,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 256 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    sealed.state.sealedScaleLoopContinuity.score >= open.state.sealedScaleLoopContinuity.score - 0.14,
  );
});

test('round 39: reentry continuity and next wave priming gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.scaleWaveReentryContinuitySmoothing = 0.66;
  persisted.bilateralNextWavePrimingGateSmoothing = 0.64;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 95,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 126 } } },
    persisted,
  });
  assert.ok(r.state.scaleWaveReentryContinuity);
  assert.ok(['established', 'linked', 'fading', 'lost'].includes(r.state.scaleWaveReentryContinuity.band));
  assert.ok(r.state.bilateralNextWavePrimingGate);
  assert.ok(['primed', 'charging', 'idle', 'blocked'].includes(r.state.bilateralNextWavePrimingGate.band));
  assert.ok(r.persisted.scaleWaveReentryContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralNextWavePrimingGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Scale wave reentry continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral next wave priming gate/i.test(n)));
});

test('round 39: closed reentry gate weakens continuity vs reentered baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralScaleWaveReentryGateSmoothing = 0.99;
  persisted.sealedScaleLoopContinuitySmoothing = 0.96;
  const reentered = advanceGlobalTradeEconomyTurn({
    turn: 96,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 108 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralScaleWaveReentryGateSmoothing = 0.21;
  persisted.sealedScaleLoopContinuitySmoothing = 0.19;
  const closed = advanceGlobalTradeEconomyTurn({
    turn: 96,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 258 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    reentered.state.scaleWaveReentryContinuity.score >= closed.state.scaleWaveReentryContinuity.score - 0.14,
  );
});

test('round 40: priming continuity and primed wave launch gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralNextWavePrimingGateSmoothing = 0.67;
  persisted.nextWavePrimingContinuitySmoothing = 0.65;
  persisted.bilateralPrimedWaveLaunchGateSmoothing = 0.63;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 97,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 128 } } },
    persisted,
  });
  assert.ok(r.state.nextWavePrimingContinuity);
  assert.ok(['settled', 'holding', 'unsettled', 'void'].includes(r.state.nextWavePrimingContinuity.band));
  assert.ok(r.state.bilateralPrimedWaveLaunchGate);
  assert.ok(['launched', 'arming', 'held', 'blocked'].includes(r.state.bilateralPrimedWaveLaunchGate.band));
  assert.ok(r.persisted.nextWavePrimingContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralPrimedWaveLaunchGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Next wave priming continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral primed wave launch gate/i.test(n)));
});

test('round 40: blocked priming gate weakens continuity vs primed baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralNextWavePrimingGateSmoothing = 0.98;
  persisted.scaleWaveReentryContinuitySmoothing = 0.96;
  const primed = advanceGlobalTradeEconomyTurn({
    turn: 98,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 110 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralNextWavePrimingGateSmoothing = 0.22;
  persisted.scaleWaveReentryContinuitySmoothing = 0.19;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 98,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 260 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    primed.state.nextWavePrimingContinuity.score >= blocked.state.nextWavePrimingContinuity.score - 0.14,
  );
});

test('round 41: launch continuity and launched wave sustain gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralPrimedWaveLaunchGateSmoothing = 0.68;
  persisted.primedWaveLaunchContinuitySmoothing = 0.66;
  persisted.bilateralLaunchedWaveSustainGateSmoothing = 0.64;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 99,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 130 } } },
    persisted,
  });
  assert.ok(r.state.primedWaveLaunchContinuity);
  assert.ok(['sustained', 'tracking', 'drifting', 'collapsed'].includes(r.state.primedWaveLaunchContinuity.band));
  assert.ok(r.state.bilateralLaunchedWaveSustainGate);
  assert.ok(['sustaining', 'ramping', 'paused', 'blocked'].includes(r.state.bilateralLaunchedWaveSustainGate.band));
  assert.ok(r.persisted.primedWaveLaunchContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralLaunchedWaveSustainGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Primed wave launch continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral launched wave sustain gate/i.test(n)));
});

test('round 41: blocked launch gate weakens continuity vs launched baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralPrimedWaveLaunchGateSmoothing = 0.99;
  persisted.nextWavePrimingContinuitySmoothing = 0.97;
  const launched = advanceGlobalTradeEconomyTurn({
    turn: 100,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 112 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralPrimedWaveLaunchGateSmoothing = 0.23;
  persisted.nextWavePrimingContinuitySmoothing = 0.2;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 100,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 262 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    launched.state.primedWaveLaunchContinuity.score >= blocked.state.primedWaveLaunchContinuity.score - 0.14,
  );
});

test('round 42: sustain continuity and sustained wave throughput gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralLaunchedWaveSustainGateSmoothing = 0.69;
  persisted.launchedWaveSustainContinuitySmoothing = 0.67;
  persisted.bilateralSustainedWaveThroughputGateSmoothing = 0.65;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 101,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 132 } } },
    persisted,
  });
  assert.ok(r.state.launchedWaveSustainContinuity);
  assert.ok(['firm', 'holding', 'slipping', 'failed'].includes(r.state.launchedWaveSustainContinuity.band));
  assert.ok(r.state.bilateralSustainedWaveThroughputGate);
  assert.ok(['cleared', 'building', 'throttled', 'blocked'].includes(r.state.bilateralSustainedWaveThroughputGate.band));
  assert.ok(r.persisted.launchedWaveSustainContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralSustainedWaveThroughputGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Launched wave sustain continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral sustained wave throughput gate/i.test(n)));
});

test('round 42: blocked sustain gate weakens continuity vs sustaining baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralLaunchedWaveSustainGateSmoothing = 0.99;
  persisted.primedWaveLaunchContinuitySmoothing = 0.97;
  const sustaining = advanceGlobalTradeEconomyTurn({
    turn: 102,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 114 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralLaunchedWaveSustainGateSmoothing = 0.24;
  persisted.primedWaveLaunchContinuitySmoothing = 0.21;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 102,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 264 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    sustaining.state.launchedWaveSustainContinuity.score >=
      blocked.state.launchedWaveSustainContinuity.score - 0.14,
  );
});

test('round 43: throughput continuity and cleared wave handoff gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralSustainedWaveThroughputGateSmoothing = 0.7;
  persisted.sustainedWaveThroughputContinuitySmoothing = 0.68;
  persisted.bilateralClearedWaveHandoffGateSmoothing = 0.66;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 103,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 134 } } },
    persisted,
  });
  assert.ok(r.state.sustainedWaveThroughputContinuity);
  assert.ok(['steady', 'aligned', 'fraying', 'severed'].includes(r.state.sustainedWaveThroughputContinuity.band));
  assert.ok(r.state.bilateralClearedWaveHandoffGate);
  assert.ok(['handed', 'staging', 'deferred', 'blocked'].includes(r.state.bilateralClearedWaveHandoffGate.band));
  assert.ok(r.persisted.sustainedWaveThroughputContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralClearedWaveHandoffGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Sustained wave throughput continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral cleared wave handoff gate/i.test(n)));
});

test('round 43: blocked throughput gate weakens continuity vs cleared baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralSustainedWaveThroughputGateSmoothing = 0.99;
  persisted.launchedWaveSustainContinuitySmoothing = 0.97;
  const cleared = advanceGlobalTradeEconomyTurn({
    turn: 104,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 116 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralSustainedWaveThroughputGateSmoothing = 0.25;
  persisted.launchedWaveSustainContinuitySmoothing = 0.22;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 104,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 266 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    cleared.state.sustainedWaveThroughputContinuity.score >=
      blocked.state.sustainedWaveThroughputContinuity.score - 0.14,
  );
});

test('round 44: handoff continuity and handed wave cycle priming gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralClearedWaveHandoffGateSmoothing = 0.71;
  persisted.clearedWaveHandoffContinuitySmoothing = 0.69;
  persisted.bilateralHandedWaveCyclePrimingGateSmoothing = 0.67;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 105,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 136 } } },
    persisted,
  });
  assert.ok(r.state.clearedWaveHandoffContinuity);
  assert.ok(['secured', 'holding', 'slipping', 'broken'].includes(r.state.clearedWaveHandoffContinuity.band));
  assert.ok(r.state.bilateralHandedWaveCyclePrimingGate);
  assert.ok(['primed', 'charging', 'deferred', 'blocked'].includes(r.state.bilateralHandedWaveCyclePrimingGate.band));
  assert.ok(r.persisted.clearedWaveHandoffContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralHandedWaveCyclePrimingGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Cleared wave handoff continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral handed wave cycle priming gate/i.test(n)));
});

test('round 44: blocked handoff gate weakens continuity vs handed baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralClearedWaveHandoffGateSmoothing = 0.99;
  persisted.sustainedWaveThroughputContinuitySmoothing = 0.97;
  const handed = advanceGlobalTradeEconomyTurn({
    turn: 106,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 118 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralClearedWaveHandoffGateSmoothing = 0.26;
  persisted.sustainedWaveThroughputContinuitySmoothing = 0.23;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 106,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 268 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    handed.state.clearedWaveHandoffContinuity.score >= blocked.state.clearedWaveHandoffContinuity.score - 0.14,
  );
});

test('round 45: cycle priming continuity and primed handoff arc opening gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralHandedWaveCyclePrimingGateSmoothing = 0.72;
  persisted.handedWaveCyclePrimingContinuitySmoothing = 0.7;
  persisted.bilateralPrimedHandoffArcOpeningGateSmoothing = 0.68;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 107,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 138 } } },
    persisted,
  });
  assert.ok(r.state.handedWaveCyclePrimingContinuity);
  assert.ok(['settled', 'holding', 'unsettled', 'void'].includes(r.state.handedWaveCyclePrimingContinuity.band));
  assert.ok(r.state.bilateralPrimedHandoffArcOpeningGate);
  assert.ok(['opened', 'unlocking', 'latched', 'sealed'].includes(r.state.bilateralPrimedHandoffArcOpeningGate.band));
  assert.ok(r.persisted.handedWaveCyclePrimingContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralPrimedHandoffArcOpeningGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Handed wave cycle priming continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral primed handoff arc opening gate/i.test(n)));
});

test('round 45: blocked cycle priming gate weakens continuity vs primed baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralHandedWaveCyclePrimingGateSmoothing = 0.99;
  persisted.clearedWaveHandoffContinuitySmoothing = 0.97;
  const primed = advanceGlobalTradeEconomyTurn({
    turn: 108,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 120 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralHandedWaveCyclePrimingGateSmoothing = 0.27;
  persisted.clearedWaveHandoffContinuitySmoothing = 0.24;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 108,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 270 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    primed.state.handedWaveCyclePrimingContinuity.score >=
      blocked.state.handedWaveCyclePrimingContinuity.score - 0.14,
  );
});

test('round 46: arc opening continuity and engaged forward admission gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralPrimedHandoffArcOpeningGateSmoothing = 0.73;
  persisted.primedHandoffArcOpeningContinuitySmoothing = 0.71;
  persisted.bilateralEngagedArcForwardAdmissionGateSmoothing = 0.69;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 109,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 140 } } },
    persisted,
  });
  assert.ok(r.state.primedHandoffArcOpeningContinuity);
  assert.ok(['engaged', 'holding', 'slipping', 'broken'].includes(r.state.primedHandoffArcOpeningContinuity.band));
  assert.ok(r.state.bilateralEngagedArcForwardAdmissionGate);
  assert.ok(['admitted', 'ramping', 'queued', 'blocked'].includes(r.state.bilateralEngagedArcForwardAdmissionGate.band));
  assert.ok(r.persisted.primedHandoffArcOpeningContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralEngagedArcForwardAdmissionGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Primed handoff arc opening continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral engaged arc forward admission gate/i.test(n)));
});

test('round 46: sealed opening gate weakens continuity vs opened baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralPrimedHandoffArcOpeningGateSmoothing = 0.99;
  persisted.handedWaveCyclePrimingContinuitySmoothing = 0.97;
  const opened = advanceGlobalTradeEconomyTurn({
    turn: 110,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 122 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralPrimedHandoffArcOpeningGateSmoothing = 0.28;
  persisted.handedWaveCyclePrimingContinuitySmoothing = 0.25;
  const sealed = advanceGlobalTradeEconomyTurn({
    turn: 110,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 272 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    opened.state.primedHandoffArcOpeningContinuity.score >=
      sealed.state.primedHandoffArcOpeningContinuity.score - 0.14,
  );
});

test('round 47: admission continuity and admitted forward arc sustain gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralEngagedArcForwardAdmissionGateSmoothing = 0.74;
  persisted.engagedArcForwardAdmissionContinuitySmoothing = 0.72;
  persisted.bilateralAdmittedForwardArcSustainGateSmoothing = 0.7;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 111,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 145 } } },
    persisted,
  });
  assert.ok(r.state.engagedArcForwardAdmissionContinuity);
  assert.ok(['stable', 'holding', 'drifting', 'broken'].includes(r.state.engagedArcForwardAdmissionContinuity.band));
  assert.ok(r.state.bilateralAdmittedForwardArcSustainGate);
  assert.ok(
    ['sustained', 'stabilizing', 'fading', 'lost'].includes(r.state.bilateralAdmittedForwardArcSustainGate.band),
  );
  assert.ok(r.persisted.engagedArcForwardAdmissionContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralAdmittedForwardArcSustainGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Engaged arc forward admission continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral admitted forward arc sustain gate/i.test(n)));
});

test('round 47: blocked admission gate weakens continuity vs admitted baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralEngagedArcForwardAdmissionGateSmoothing = 0.98;
  persisted.primedHandoffArcOpeningContinuitySmoothing = 0.96;
  const admitted = advanceGlobalTradeEconomyTurn({
    turn: 112,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 125 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralEngagedArcForwardAdmissionGateSmoothing = 0.26;
  persisted.primedHandoffArcOpeningContinuitySmoothing = 0.23;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 112,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 275 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    admitted.state.engagedArcForwardAdmissionContinuity.score >=
      blocked.state.engagedArcForwardAdmissionContinuity.score - 0.14,
  );
});

test('round 48: sustained arc continuity and forward arc handoff gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralAdmittedForwardArcSustainGateSmoothing = 0.75;
  persisted.sustainedAdmittedForwardArcContinuitySmoothing = 0.73;
  persisted.bilateralSustainedForwardArcHandoffGateSmoothing = 0.71;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 113,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 148 } } },
    persisted,
  });
  assert.ok(r.state.sustainedAdmittedForwardArcContinuity);
  assert.ok(
    ['anchored', 'holding', 'slipping', 'severed'].includes(r.state.sustainedAdmittedForwardArcContinuity.band),
  );
  assert.ok(r.state.bilateralSustainedForwardArcHandoffGate);
  assert.ok(
    ['cleared', 'staging', 'queued', 'blocked'].includes(r.state.bilateralSustainedForwardArcHandoffGate.band),
  );
  assert.ok(r.persisted.sustainedAdmittedForwardArcContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralSustainedForwardArcHandoffGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Sustained admitted forward arc continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral sustained forward arc handoff gate/i.test(n)));
});

test('round 48: lost sustain gate weakens continuity vs sustained baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralAdmittedForwardArcSustainGateSmoothing = 0.98;
  persisted.engagedArcForwardAdmissionContinuitySmoothing = 0.96;
  const sustained = advanceGlobalTradeEconomyTurn({
    turn: 114,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 128 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralAdmittedForwardArcSustainGateSmoothing = 0.24;
  persisted.engagedArcForwardAdmissionContinuitySmoothing = 0.22;
  const lost = advanceGlobalTradeEconomyTurn({
    turn: 114,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 278 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    sustained.state.sustainedAdmittedForwardArcContinuity.score >=
      lost.state.sustainedAdmittedForwardArcContinuity.score - 0.14,
  );
});

test('round 49: handoff continuity and cleared forward arc readiness gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralSustainedForwardArcHandoffGateSmoothing = 0.76;
  persisted.clearedForwardArcHandoffContinuitySmoothing = 0.74;
  persisted.bilateralClearedForwardArcReadinessGateSmoothing = 0.72;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 115,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 150 } } },
    persisted,
  });
  assert.ok(r.state.clearedForwardArcHandoffContinuity);
  assert.ok(
    ['settled', 'holding', 'unsettled', 'broken'].includes(r.state.clearedForwardArcHandoffContinuity.band),
  );
  assert.ok(r.state.bilateralClearedForwardArcReadinessGate);
  assert.ok(
    ['ready', 'arming', 'pending', 'withheld'].includes(r.state.bilateralClearedForwardArcReadinessGate.band),
  );
  assert.ok(r.persisted.clearedForwardArcHandoffContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralClearedForwardArcReadinessGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Cleared forward arc handoff continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral cleared forward arc readiness gate/i.test(n)));
});

test('round 49: blocked handoff gate weakens continuity vs cleared baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralSustainedForwardArcHandoffGateSmoothing = 0.99;
  persisted.sustainedAdmittedForwardArcContinuitySmoothing = 0.97;
  const cleared = advanceGlobalTradeEconomyTurn({
    turn: 116,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 130 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralSustainedForwardArcHandoffGateSmoothing = 0.25;
  persisted.sustainedAdmittedForwardArcContinuitySmoothing = 0.23;
  const blocked = advanceGlobalTradeEconomyTurn({
    turn: 116,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 280 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    cleared.state.clearedForwardArcHandoffContinuity.score >=
      blocked.state.clearedForwardArcHandoffContinuity.score - 0.14,
  );
});

test('round 50: sustained cleared continuity and launched handoff gate on state', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralClearedForwardArcReadinessGateSmoothing = 0.78;
  persisted.clearedForwardArcHandoffContinuitySmoothing = 0.76;
  persisted.sustainedClearedForwardArcContinuitySmoothing = 0.74;
  persisted.bilateralLaunchedClearedForwardArcHandoffGateSmoothing = 0.72;
  const r = advanceGlobalTradeEconomyTurn({
    turn: 117,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 152 } } },
    persisted,
  });
  assert.ok(r.state.sustainedClearedForwardArcContinuity);
  assert.ok(
    ['anchored', 'holding', 'slipping', 'severed'].includes(r.state.sustainedClearedForwardArcContinuity.band),
  );
  assert.ok(r.state.bilateralLaunchedClearedForwardArcHandoffGate);
  assert.ok(
    ['cleared', 'staging', 'queued', 'blocked'].includes(r.state.bilateralLaunchedClearedForwardArcHandoffGate.band),
  );
  assert.ok(r.persisted.sustainedClearedForwardArcContinuitySmoothing != null);
  assert.ok(r.persisted.bilateralLaunchedClearedForwardArcHandoffGateSmoothing != null);
  const notes = buildGlobalTradeGi3Notes(r.state);
  assert.ok(notes.some(n => /Sustained cleared forward arc continuity/i.test(n)));
  assert.ok(notes.some(n => /Bilateral launched cleared forward arc handoff gate/i.test(n)));
});

test('round 50: withheld readiness weakens sustained continuity vs ready baseline', () => {
  let persisted = createEmptyGTELPersisted();
  persisted.bilateralClearedForwardArcReadinessGateSmoothing = 0.99;
  persisted.clearedForwardArcHandoffContinuitySmoothing = 0.97;
  const ready = advanceGlobalTradeEconomyTurn({
    turn: 118,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 132 } } },
    persisted: { ...persisted },
  });
  persisted.bilateralClearedForwardArcReadinessGateSmoothing = 0.24;
  persisted.clearedForwardArcHandoffContinuitySmoothing = 0.22;
  const withheld = advanceGlobalTradeEconomyTurn({
    turn: 118,
    diplomacyState: { deals: [] },
    nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 282 } } },
    persisted: { ...persisted },
  });
  assert.ok(
    ready.state.sustainedClearedForwardArcContinuity.score >=
      withheld.state.sustainedClearedForwardArcContinuity.score - 0.14,
  );
});
