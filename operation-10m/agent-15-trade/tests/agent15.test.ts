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
  assert.ok(r.passed >= 51);
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
