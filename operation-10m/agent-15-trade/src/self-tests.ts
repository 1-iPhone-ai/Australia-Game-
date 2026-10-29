import { createEmptyGTELPersisted } from './persist.ts';
import {
  createTradeAgreementFromTemplate,
  deriveTradeAgreementModifiers,
  ratifyTradeAgreement,
} from './trade-agreements.ts';
import { advanceGlobalTradeEconomyTurn } from './trade-turn.ts';
import { applyGlobalTradeHouseholdOverrides } from './household-bridge.ts';
import { activateWorldTradeShock, scheduledShockIdForTurn } from './world-shocks.ts';
import { advancePartnerSanctions, deriveSanctionModifiers } from './sanctions.ts';
import { advancePartnerTrustScores, deriveTrustAccessModifiers } from './partner-trust.ts';
import { autoTradePolicyAdjustments } from './trade-policy.ts';
import { advanceTradeDisputes, openTradeDispute } from './trade-disputes.ts';
import { advanceTradeComplianceRecord } from './trade-compliance.ts';
import { computeLogisticsStress } from './export-logistics.ts';
import { computeTradeBalanceSnapshot } from './trade-balance.ts';
import { computeImportDependencySnapshot, importDependencyConsumerPressure } from './import-dependency.ts';
import { advanceDiplomaticEngagement, deriveEngagementPartnerModifiers } from './diplomatic-engagement.ts';
import { computeTradeFinanceSnapshot } from './trade-finance.ts';
import {
  computeMarketDiversificationSnapshot,
  deriveDiversificationPartnerModifiers,
} from './market-diversification.ts';
import { computeTermsOfTradeSnapshot, termsOfTradeHouseholdModifier } from './terms-of-trade.ts';
import {
  computeSupplyChainResilienceSnapshot,
  supplyChainResilienceExportScale,
} from './supply-chain-resilience.ts';
import { computeForeignExchangeSnapshot } from './foreign-exchange-pressure.ts';
import {
  computeTradeRetaliationSnapshot,
  createEmptyTradeRetaliationSnapshot,
  deriveRetaliationPartnerModifiers,
} from './trade-retaliation.ts';
import {
  computeTradeDeescalationSnapshot,
  createEmptyTradeDeescalationSnapshot,
  deriveDeescalationPartnerModifiers,
} from './trade-deescalation.ts';
import {
  computeExportCapacitySnapshot,
  createEmptyExportCapacitySnapshot,
  exportCapacityExportScale,
} from './export-capacity-allocation.ts';
import {
  computeTradeReconciliationSnapshot,
  createEmptyTradeReconciliationSnapshot,
  deriveReconciliationPartnerModifiers,
} from './trade-reconciliation.ts';
import { computeMaritimeRiskSnapshot, createEmptyMaritimeRiskSnapshot, maritimeRiskExportScale } from './maritime-risk-premium.ts';
import {
  computePreferentialUtilizationSnapshot,
  preferentialUtilizationExportScale,
} from './preferential-access-utilization.ts';
import {
  computeTradeEnforcementSnapshot,
  createEmptyTradeEnforcementSnapshot,
  deriveEnforcementPartnerModifiers,
  enforcementExportScale,
} from './trade-enforcement-intensity.ts';
import {
  computeExportInsuranceStackSnapshot,
  exportInsuranceStackExportScale,
} from './export-credit-insurance-stack.ts';
import {
  computePartnerAccessRestorationSnapshot,
  deriveAccessRestorationPartnerModifiers,
} from './partner-access-restoration.ts';
import {
  computeSanctionsSpilloverSnapshot,
  deriveSanctionsSpilloverPartnerModifiers,
  sanctionsSpilloverExportScale,
} from './sanctions-spillover-depth.ts';
import {
  computeTradeCorridorResilienceSnapshot,
  tradeCorridorExportScale,
} from './trade-corridor-resilience.ts';
import {
  computeTradeFxHedgingSnapshot,
  tradeFxHedgingExportScale,
} from './trade-fx-hedging.ts';
import {
  computeImportLanePressureSnapshot,
  importLanePressureExportScale,
} from './import-lane-pressure.ts';
import { createEmptyTradeFinanceSnapshot } from './trade-finance.ts';
import { GTEL_PARTNER_DEFS, GTEL_COMMODITIES } from './constants.ts';
import {
  validateScenarioShockCatalog,
  triggerCommodityShockScenario,
  COMMODITY_SHOCK_SCENARIOS,
} from './commodity-shock-scenarios.ts';
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

  ok('sanctions escalate on repeated violations', () => {
    let persisted = createEmptyGTELPersisted();
    const dip = {
      deals: [
        { id: 'v1', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' },
        { id: 'v2', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' },
      ],
      events: [{ kind: 'violation', turn: 6, text: 'embargo asia_pacific breach' }],
    };
    const step = advancePartnerSanctions(persisted, dip, 7);
    persisted = step.persisted;
    const mods = deriveSanctionModifiers(persisted);
    gtelAssert((mods.activeTiers.asia_pacific || 'none') !== 'none', 'expected asia sanctions');
    gtelAssert(mods.partnerDeltas.asia_pacific! < 0, 'partner penalty');
  });

  ok('commodity shock scenario registers catalog shocks', () => {
    const missing = validateScenarioShockCatalog();
    gtelAssert(missing.length === 0, `missing shocks: ${missing.join(',')}`);
    let persisted = createEmptyGTELPersisted();
    const r = triggerCommodityShockScenario(persisted, 'scenario_agri_stress', 20);
    gtelAssert(r.scenario !== null, 'scenario missing');
    gtelAssert(r.activatedShockIds.length >= 1, 'no shocks activated');
    gtelAssert(r.persisted.firedShockScenarios.includes('scenario_agri_stress'), 'scenario not recorded');
  });

  ok('scenario does not double-fire', () => {
    let persisted = createEmptyGTELPersisted();
    persisted = triggerCommodityShockScenario(persisted, 'scenario_bulk_crash', 100).persisted;
    const second = triggerCommodityShockScenario(persisted, 'scenario_bulk_crash', 101);
    gtelAssert(second.activatedShockIds.length === 0, 'should not reactivate');
  });

  ok('partner trust responds to sanctions', () => {
    let persisted = createEmptyGTELPersisted();
    const before = advancePartnerTrustScores(persisted, { deals: [] }, 4, {}).partnerTrust?.asia_pacific?.score;
    persisted.partnerSanctions = {
      asia_pacific: {
        partnerId: 'asia_pacific',
        tier: 'sectoral',
        escalatedTurn: 3,
        cooldownUntilTurn: null,
        violationStreak: 2,
        complianceStreak: 0,
        scopedCommodities: ['iron_ore'],
        reason: 'test',
      },
    };
    persisted = advancePartnerTrustScores(persisted, { deals: [] }, 4, { asia_pacific: 'sectoral' });
    const after = persisted.partnerTrust?.asia_pacific?.score;
    gtelAssert(typeof before === 'number' && typeof after === 'number' && after < before, 'trust should fall under sectoral sanctions');
  });

  ok('trade policy diversification activates under restriction', () => {
    let persisted = createEmptyGTELPersisted();
    persisted.partnerAccess = { asia_pacific: 'blocked', europe: 'restricted' };
    persisted = autoTradePolicyAdjustments(persisted, 6);
    gtelAssert(persisted.tradePolicies.some(p => p.kind === 'diversification_push'), 'missing diversification policy');
  });

  ok('trade dispute resolution steps down sanctions', () => {
    let persisted = createEmptyGTELPersisted();
    persisted.partnerSanctions = {
      europe: {
        partnerId: 'europe',
        tier: 'sectoral',
        escalatedTurn: 1,
        cooldownUntilTurn: null,
        violationStreak: 2,
        complianceStreak: 0,
        scopedCommodities: ['services'],
        reason: 'test',
      },
    };
    const opened = openTradeDispute(persisted, 'europe', 1, 'Test dispute');
    persisted = opened.persisted;
    persisted.tradeDisputes = (persisted.tradeDisputes || []).map(d => ({ ...d, openedTurn: 1, status: 'open' as const }));
    const resolved = advanceTradeDisputes(persisted, 6, { europe: 'none' });
    gtelAssert(resolved.persisted.partnerSanctions?.europe?.tier !== 'sectoral', 'sanctions should step down');
  });

  ok('trade compliance falls after violations', () => {
    let persisted = createEmptyGTELPersisted();
    const base = persisted.tradeCompliance.score;
    persisted = advanceTradeComplianceRecord(
      persisted,
      {
        deals: [{ id: 'x', type: 'resource_trade', status: 'violated', participants: ['p', 'a'], compliance: 'violated' }],
        events: [{ kind: 'violation', turn: 2, text: 'breach' }],
      },
      3,
    );
    gtelAssert(persisted.tradeCompliance.score < base, 'compliance should drop');
  });

  ok('logistics congestion under critical network', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'normal' as const, accessScore: 0.6 }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 140 } } },
      partners,
      exportThroughput: 140,
      openDisputeCount: 2,
    });
    gtelAssert(logistics.band === 'congested' || logistics.band === 'tight', 'expected stress band');
  });

  ok('trade balance surplus when export quotes hot', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'strategic' as const, accessScore: 0.9 }));
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0.1,
      diplomacyModifier: 0,
      networkModifier: 0.05,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 112,
      trend: 'rising' as const,
      evidence: [],
    }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'surplus', exportedCapacity: 180 } } },
      partners,
      exportThroughput: 180,
      openDisputeCount: 0,
    });
    const bal = computeTradeBalanceSnapshot({ commodities, partners, logistics, exportThroughput: 180 });
    gtelAssert(bal.currentAccountTone === 'surplus' || bal.currentAccountTone === 'mild_surplus', 'expected surplus tone');
  });

  ok('import dependency rises when partners restricted', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('normal' as const),
      accessScore: p.id === 'asia_pacific' ? 0.15 : 0.55,
    }));
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 108,
      trend: 'rising' as const,
      evidence: [],
    }));
    const step = computeImportDependencySnapshot({
      partners,
      commodities,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(step.snapshot.lines.length === GTEL_COMMODITIES.length, 'missing dependency lines');
    gtelAssert(step.snapshot.aggregateRisk > 0.25, 'expected elevated aggregate risk');
    gtelAssert(importDependencyConsumerPressure(step.snapshot) > 0, 'expected consumer pressure');
  });

  ok('diplomatic engagement boosts partner under active deals', () => {
    const dip = {
      deals: [
        {
          id: 'd1',
          type: 'resource_trade',
          status: 'active',
          participants: ['player', 'rival_east'],
          compliance: 'compliant',
        },
      ],
    };
    const step = advanceDiplomaticEngagement(createEmptyGTELPersisted(), dip, 9);
    const asiaTrack = step.state.tracks?.asia_pacific;
    gtelAssert(Boolean(asiaTrack), 'missing asia track');
    gtelAssert(asiaTrack!.momentum > 0.45, 'expected engagement momentum lift');
    const mods = deriveEngagementPartnerModifiers(step.state);
    gtelAssert((mods.partnerDeltas.asia_pacific || 0) >= 0, 'asia engagement should not penalize active deal');
  });

  ok('trade finance tightens under congested logistics', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'normal' as const, accessScore: 0.55 }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 140 } } },
      partners,
      exportThroughput: 140,
      openDisputeCount: 2,
    });
    const balance = computeTradeBalanceSnapshot({
      commodities: GTEL_COMMODITIES.map(c => ({
        commodity: c,
        baseIndex: 100,
        partnerModifier: 0,
        diplomacyModifier: 0,
        networkModifier: 0,
        shockModifier: 0,
        agreementModifier: 0,
        effectiveIndex: 102,
        trend: 'stable' as const,
        evidence: [],
      })),
      partners,
      logistics,
      exportThroughput: 140,
    });
    const step = computeTradeFinanceSnapshot({
      logistics,
      tradeBalance: balance,
      tradeCompliance: createEmptyGTELPersisted().tradeCompliance,
      openDisputeCount: 2,
      activeSanctionCount: 1,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(step.snapshot.band !== 'fluid', 'expected non-fluid finance under stress');
    gtelAssert(step.snapshot.financingPremium > 0.35, 'expected financing premium');
  });

  ok('market diversification flags concentrated partner mix', () => {
    const persisted = createEmptyGTELPersisted();
    persisted.partnerMixSmoothing = {
      asia_pacific: 0.78,
      india_ocean: 0.07,
      north_america: 0.07,
      europe: 0.06,
    };
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('normal' as const),
      accessScore: p.id === 'asia_pacific' ? 0.12 : 0.5,
    }));
    const snapshot = computeMarketDiversificationSnapshot({ partners, persisted });
    gtelAssert(snapshot.band === 'concentrated' || snapshot.band === 'critical', 'expected concentration band');
    const mods = deriveDiversificationPartnerModifiers(snapshot);
    gtelAssert(mods.domesticStress > 0, 'expected diversification domestic stress');
  });

  ok('terms of trade deteriorate when import dependency critical', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('restricted' as const),
      accessScore: 0.2,
    }));
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: c === 'manufacturing' ? 118 : 101,
      trend: 'stable' as const,
      evidence: [],
    }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 120 } } },
      partners,
      exportThroughput: 120,
      openDisputeCount: 2,
    });
    const balance = computeTradeBalanceSnapshot({ commodities, partners, logistics, exportThroughput: 120 });
    const dep = computeImportDependencySnapshot({ partners, commodities, persisted: createEmptyGTELPersisted() });
    const step = computeTermsOfTradeSnapshot({
      commodities,
      tradeBalance: balance,
      importDependency: dep.snapshot,
      persisted: dep.persisted,
    });
    gtelAssert(step.snapshot.index < 1, 'expected sub-neutral terms index');
    gtelAssert(termsOfTradeHouseholdModifier(step.snapshot) <= 0, 'expected household squeeze');
  });

  ok('supply chain resilience brittle under stacked chokepoints', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('normal' as const),
      accessScore: p.id === 'asia_pacific' ? 0.12 : 0.5,
    }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 150 } } },
      partners,
      exportThroughput: 150,
      openDisputeCount: 3,
    });
    const persisted = createEmptyGTELPersisted();
    persisted.supplyChainResilienceSmoothing = 0.22;
    persisted.partnerMixSmoothing = { asia_pacific: 0.8, india_ocean: 0.07, north_america: 0.07, europe: 0.06 };
    const diversification = computeMarketDiversificationSnapshot({ partners, persisted });
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 110,
      trend: 'rising' as const,
      evidence: [],
    }));
    const dep = computeImportDependencySnapshot({ partners, commodities, persisted });
    const step = computeSupplyChainResilienceSnapshot({
      logistics,
      marketDiversification: diversification,
      importDependency: dep.snapshot,
      openDisputeCount: 3,
      persisted: dep.persisted,
    });
    gtelAssert(step.snapshot.band === 'fragile' || step.snapshot.band === 'brittle', 'expected fragile resilience');
    gtelAssert(supplyChainResilienceExportScale(step.snapshot) < 1, 'expected export scale haircut');
  });

  ok('foreign exchange stress when finance frozen and deficit tone', () => {
    const terms = {
      index: 0.92,
      band: 'unfavorable' as const,
      exportBasketIndex: 98,
      importBasketIndex: 108,
      summary: 'test',
    };
    const balance = {
      exportValueIndex: 92,
      importPressureIndex: 112,
      netExportPulse: -0.12,
      currentAccountTone: 'deficit' as const,
      effectiveThroughput: 80,
      narrative: 'test',
    };
    const finance = {
      availabilityScore: 0.28,
      band: 'frozen' as const,
      financingPremium: 0.42,
      exportCreditCeiling: 70,
      summary: 'test',
    };
    const step = computeForeignExchangeSnapshot({
      termsOfTrade: terms,
      tradeBalance: balance,
      tradeFinance: finance,
      persisted: { ...createEmptyGTELPersisted(), foreignExchangeSmoothing: 0.88 },
    });
    gtelAssert(
      step.snapshot.band === 'stress' || step.snapshot.band === 'crisis' || step.snapshot.pressureIndex < 0.96,
      'expected FX stress',
    );
    gtelAssert(step.snapshot.pressureIndex < 0.96, 'expected sub-neutral FX index');
  });

  ok('trade retaliation escalates with disputes and sanctions', () => {
    const engagement = {
      tracks: {},
      summitPulse: 0.2,
      summary: 'test',
    };
    const step = computeTradeRetaliationSnapshot({
      openDisputeCount: 3,
      activeSanctionCount: 2,
      engagement,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(
      ['watch', 'active', 'escalating'].includes(step.snapshot.band),
      'expected retaliation band',
    );
    const mods = deriveRetaliationPartnerModifiers(step.snapshot);
    gtelAssert(mods.domesticStress > 0, 'expected retaliation domestic stress');
  });

  ok('trade de-escalation warms with summit pulse and compliance', () => {
    const retaliation = computeTradeRetaliationSnapshot({
      openDisputeCount: 1,
      activeSanctionCount: 0,
      engagement: { tracks: {}, summitPulse: 0.2, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const cold = computeTradeDeescalationSnapshot({
      openDisputeCount: 2,
      engagement: { tracks: {}, summitPulse: 0.15, summary: 'test' },
      tradeRetaliation: retaliation,
      complianceScore: 0.5,
      persisted: createEmptyGTELPersisted(),
    });
    const warm = computeTradeDeescalationSnapshot({
      openDisputeCount: 0,
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.78, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.82,
        summary: 'test',
      },
      tradeRetaliation: retaliation,
      complianceScore: 0.82,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(warm.snapshot.momentum > cold.snapshot.momentum, 'expected warmer de-escalation');
    const mods = deriveDeescalationPartnerModifiers(warm.snapshot);
    gtelAssert(mods.domesticStressRelief >= 0, 'relief non-negative');
  });

  ok('export capacity tightens throughput scale when saturated', () => {
    const commodities = GTEL_COMMODITIES.map(commodity => ({
      commodity,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 112,
      trend: 'rising' as const,
      evidence: ['test'],
    }));
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'preferred' as const, accessScore: 0.82 }));
    const logistics = {
      band: 'congested' as const,
      freightPressure: 0.82,
      redundancyScore: 0.35,
      effectiveExportThroughput: 150,
      networkStrain: 0.78,
      summary: 'test',
    };
    const step = computeExportCapacitySnapshot({
      commodities,
      partners,
      logistics,
      termsOfTrade: { index: 0.94, band: 'unfavorable', exportBasketIndex: 96, importBasketIndex: 104, summary: 'test' },
      marketDiversification: {
        concentrationIndex: 0.72,
        band: 'concentrated',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 2.1,
        summary: 'test',
      },
      exportThroughput: 150,
      persisted: { ...createEmptyGTELPersisted(), exportCapacitySmoothing: 0.92 },
    });
    gtelAssert(step.snapshot.band === 'tight' || step.snapshot.band === 'saturated', 'expected tight capacity');
    gtelAssert(exportCapacityExportScale(step.snapshot) <= 0.99, 'expected throughput scale drag');
  });

  ok('trade reconciliation advances with de-escalation breakthrough', () => {
    const deescalation = computeTradeDeescalationSnapshot({
      openDisputeCount: 1,
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.8, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.75,
        summary: 'test',
      },
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      complianceScore: 0.8,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const stalled = computeTradeReconciliationSnapshot({
      openDisputeCount: 3,
      complianceScore: 0.52,
      tradeDeescalation: createEmptyTradeDeescalationSnapshot(),
      engagement: { tracks: {}, summitPulse: 0.1, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    });
    const advanced = computeTradeReconciliationSnapshot({
      openDisputeCount: 2,
      complianceScore: 0.82,
      tradeDeescalation: deescalation,
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.8, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.75,
        summary: 'test',
      },
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(advanced.snapshot.progress > stalled.snapshot.progress, 'expected reconciliation progress');
    const mods = deriveReconciliationPartnerModifiers(advanced.snapshot);
    gtelAssert(mods.domesticStressRelief >= 0, 'reconciliation relief non-negative');
  });

  ok('maritime risk premium tightens throughput when logistics congested', () => {
    const calm = computeMaritimeRiskSnapshot({
      logistics: {
        band: 'fluid',
        freightPressure: 0.2,
        redundancyScore: 0.8,
        effectiveExportThroughput: 90,
        networkStrain: 0.15,
        summary: 'test',
      },
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      activeSanctionCount: 0,
      exportCapacity: createEmptyExportCapacitySnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const stressed = computeMaritimeRiskSnapshot({
      logistics: {
        band: 'congested',
        freightPressure: 0.88,
        redundancyScore: 0.3,
        effectiveExportThroughput: 150,
        networkStrain: 0.82,
        summary: 'test',
      },
      tradeRetaliation: computeTradeRetaliationSnapshot({
        openDisputeCount: 2,
        activeSanctionCount: 2,
        engagement: { tracks: {}, summitPulse: 0.2, summary: 'test' },
        persisted: createEmptyGTELPersisted(),
      }).snapshot,
      activeSanctionCount: 2,
      exportCapacity: { ...createEmptyExportCapacitySnapshot(), band: 'saturated', utilization: 0.95 },
      persisted: { ...createEmptyGTELPersisted(), maritimeRiskSmoothing: 0.62 },
    }).snapshot;
    gtelAssert(stressed.premiumIndex > calm.premiumIndex, 'expected higher maritime premium');
    gtelAssert(maritimeRiskExportScale(stressed) <= maritimeRiskExportScale(calm) + 0.01, 'expected maritime scale drag');
  });

  ok('preferential utilization rises with ratified agreements', () => {
    let persisted = createEmptyGTELPersisted();
    const draft = createTradeAgreementFromTemplate('fta_asia_bulk', 4, ['rival_east']);
    gtelAssert(!!draft, 'expected agreement draft');
    persisted = { ...persisted, agreements: [ratifyTradeAgreement(draft!, 5)] };
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'preferred' as const, accessScore: 0.82 }));
    const sparse = computePreferentialUtilizationSnapshot({
      turn: 6,
      partners,
      persisted: createEmptyGTELPersisted(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      marketDiversification: {
        concentrationIndex: 0.55,
        band: 'balanced',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 3.2,
        summary: 'test',
      },
      exportCapacity: createEmptyExportCapacitySnapshot(),
    });
    const rich = computePreferentialUtilizationSnapshot({
      turn: 6,
      partners,
      persisted,
      tradeReconciliation: {
        ...createEmptyTradeReconciliationSnapshot(),
        band: 'substantive',
        progress: 0.58,
      },
      marketDiversification: {
        concentrationIndex: 0.55,
        band: 'balanced',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 3.2,
        summary: 'test',
      },
      exportCapacity: createEmptyExportCapacitySnapshot(),
    });
    gtelAssert(rich.snapshot.utilizationRate > sparse.snapshot.utilizationRate, 'expected higher FTA utilisation');
    gtelAssert(preferentialUtilizationExportScale(rich.snapshot) >= preferentialUtilizationExportScale(sparse.snapshot), 'expected export scale lift');
  });

  ok('trade enforcement intensifies with compliance gaps', () => {
    const light = computeTradeEnforcementSnapshot({
      openDisputeCount: 0,
      tradeCompliance: { band: 'strong', score: 0.82, lastReviewTurn: 1, violationsWindow: 0, openDisputes: 0, findings: [] },
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const heavy = computeTradeEnforcementSnapshot({
      openDisputeCount: 3,
      tradeCompliance: { band: 'critical', score: 0.38, lastReviewTurn: 1, violationsWindow: 4, openDisputes: 3, findings: ['gap'] },
      tradeRetaliation: computeTradeRetaliationSnapshot({
        openDisputeCount: 3,
        activeSanctionCount: 2,
        engagement: { tracks: {}, summitPulse: 0.1, summary: 'test' },
        persisted: createEmptyGTELPersisted(),
      }).snapshot,
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: { ...createEmptyGTELPersisted(), enforcementIntensitySmoothing: 0.55 },
    }).snapshot;
    gtelAssert(heavy.intensity > light.intensity, 'expected higher enforcement intensity');
    const mods = deriveEnforcementPartnerModifiers(heavy);
    gtelAssert(mods.domesticStress > 0, 'expected enforcement domestic stress');
    gtelAssert(enforcementExportScale(heavy) <= enforcementExportScale(light) + 0.01, 'expected enforcement throughput drag');
  });

  ok('export insurance stack weakens when maritime and enforcement stress finance', () => {
    const robust = computeExportInsuranceStackSnapshot({
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.82, band: 'fluid', financingPremium: 0.06 },
      maritimeRisk: createEmptyMaritimeRiskSnapshot(),
      tradeEnforcement: createEmptyTradeEnforcementSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const impaired = computeExportInsuranceStackSnapshot({
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.28, band: 'frozen', financingPremium: 0.42 },
      maritimeRisk: { ...createEmptyMaritimeRiskSnapshot(), premiumIndex: 0.72, band: 'severe', insuranceLoad: 0.22 },
      tradeEnforcement: { ...createEmptyTradeEnforcementSnapshot(), intensity: 0.68, band: 'sweep', probeLoad: 0.2 },
      persisted: { ...createEmptyGTELPersisted(), exportInsuranceStackSmoothing: 0.35 },
    }).snapshot;
    gtelAssert(impaired.compositeScore < robust.compositeScore, 'expected weaker insurance stack');
    gtelAssert(exportInsuranceStackExportScale(impaired) <= exportInsuranceStackExportScale(robust) + 0.01, 'expected stack scale drag');
  });

  ok('partner access restoration gains momentum from de-escalation breakthrough', () => {
    const stalled = computePartnerAccessRestorationSnapshot({
      tradeDeescalation: createEmptyTradeDeescalationSnapshot(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const reopened = computePartnerAccessRestorationSnapshot({
      tradeDeescalation: {
        ...createEmptyTradeDeescalationSnapshot(),
        band: 'breakthrough',
        momentum: 0.78,
        coolingPartnerIds: ['asia_pacific'],
        retaliationAttenuation: 0.14,
      },
      tradeReconciliation: {
        ...createEmptyTradeReconciliationSnapshot(),
        band: 'settled',
        progress: 0.8,
        reconciledPartnerIds: ['asia_pacific'],
      },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(reopened.momentum > stalled.momentum, 'expected restoration momentum');
    const mods = deriveAccessRestorationPartnerModifiers(reopened);
    gtelAssert(mods.domesticStressRelief >= 0, 'restoration relief non-negative');
  });

  ok('trade corridor resilience drops when logistics congested', () => {
    const stable = computeTradeCorridorResilienceSnapshot({
      logistics: {
        band: 'fluid',
        freightPressure: 0.2,
        redundancyScore: 0.82,
        effectiveExportThroughput: 90,
        networkStrain: 0.12,
        summary: 'test',
      },
      maritimeRisk: createEmptyMaritimeRiskSnapshot(),
      supplyChainResilience: { score: 0.62, band: 'adaptive', chokepointCount: 1, redundancyIndex: 0.58, summary: 'test' },
      marketDiversification: {
        concentrationIndex: 0.48,
        band: 'balanced',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 3.4,
        summary: 'test',
      },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const fragile = computeTradeCorridorResilienceSnapshot({
      logistics: {
        band: 'congested',
        freightPressure: 0.9,
        redundancyScore: 0.28,
        effectiveExportThroughput: 160,
        networkStrain: 0.85,
        summary: 'test',
      },
      maritimeRisk: { ...createEmptyMaritimeRiskSnapshot(), premiumIndex: 0.62, band: 'severe', laneReliability: 0.42 },
      supplyChainResilience: { score: 0.32, band: 'brittle', chokepointCount: 4, redundancyIndex: 0.22, summary: 'test' },
      marketDiversification: {
        concentrationIndex: 0.78,
        band: 'critical',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 1.8,
        summary: 'test',
      },
      persisted: { ...createEmptyGTELPersisted(), tradeCorridorSmoothing: 0.38 },
    }).snapshot;
    gtelAssert(fragile.score < stable.score, 'expected lower corridor score');
    gtelAssert(tradeCorridorExportScale(fragile) <= tradeCorridorExportScale(stable) + 0.01, 'expected corridor scale drag');
  });

  ok('sanctions spillover intensifies with sectoral tiers and retaliation', () => {
    const contained = computeSanctionsSpilloverSnapshot({
      activeTiers: {},
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      tradeEnforcement: createEmptyTradeEnforcementSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const broad = computeSanctionsSpilloverSnapshot({
      activeTiers: { asia_pacific: 'sectoral', europe: 'comprehensive' },
      tradeRetaliation: computeTradeRetaliationSnapshot({
        openDisputeCount: 2,
        activeSanctionCount: 2,
        engagement: { tracks: {}, summitPulse: 0.15, summary: 'test' },
        persisted: createEmptyGTELPersisted(),
      }).snapshot,
      tradeEnforcement: { ...createEmptyTradeEnforcementSnapshot(), intensity: 0.55, band: 'intensive', probeLoad: 0.16 },
      persisted: { ...createEmptyGTELPersisted(), sanctionsSpilloverSmoothing: 0.52 },
    }).snapshot;
    gtelAssert(broad.intensity > contained.intensity, 'expected spillover intensity');
    const mods = deriveSanctionsSpilloverPartnerModifiers(broad);
    gtelAssert(mods.domesticStress > 0, 'expected spillover domestic stress');
    gtelAssert(sanctionsSpilloverExportScale(broad) <= sanctionsSpilloverExportScale(contained) + 0.01, 'expected spillover scale drag');
  });

  ok('trade FX hedging strengthens with supportive FX and favorable terms', () => {
    const weak = computeTradeFxHedgingSnapshot({
      foreignExchange: { pressureIndex: 0.88, band: 'crisis', passThroughToImports: 0.2, exportCompetitiveness: 0.4, summary: 'test' },
      termsOfTrade: { index: 0.86, band: 'severely_unfavorable', exportBasketIndex: 90, importBasketIndex: 108, summary: 'test' },
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.28, band: 'frozen' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const strong = computeTradeFxHedgingSnapshot({
      foreignExchange: { pressureIndex: 0.92, band: 'supportive', passThroughToImports: 0.08, exportCompetitiveness: 0.72, summary: 'test' },
      termsOfTrade: { index: 1.08, band: 'favorable', exportBasketIndex: 108, importBasketIndex: 98, summary: 'test' },
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.82, band: 'fluid' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(strong.effectiveness > weak.effectiveness, 'expected stronger hedging');
    gtelAssert(tradeFxHedgingExportScale(strong) >= tradeFxHedgingExportScale(weak), 'expected hedging scale lift');
  });

  ok('import lane pressure rises with critical dependency and congested logistics', () => {
    const fluid = computeImportLanePressureSnapshot({
      importDependency: { band: 'moderate', lines: [], aggregateRisk: 0.4, summary: 'test' },
      logistics: { band: 'fluid', freightPressure: 0.2, redundancyScore: 0.8, effectiveExportThroughput: 80, networkStrain: 0.1, summary: 'test' },
      tradeEnforcement: createEmptyTradeEnforcementSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const gridlocked = computeImportLanePressureSnapshot({
      importDependency: { band: 'critical', lines: [], aggregateRisk: 0.82, summary: 'test' },
      logistics: { band: 'congested', freightPressure: 0.9, redundancyScore: 0.25, effectiveExportThroughput: 150, networkStrain: 0.8, summary: 'test' },
      tradeEnforcement: { ...createEmptyTradeEnforcementSnapshot(), band: 'sweep', intensity: 0.7, probeLoad: 0.22, clearanceDelayTurns: 2 },
      persisted: { ...createEmptyGTELPersisted(), importLanePressureSmoothing: 0.68 },
    }).snapshot;
    gtelAssert(gridlocked.load > fluid.load, 'expected higher import lane load');
    gtelAssert(importLanePressureExportScale(gridlocked) <= importLanePressureExportScale(fluid) + 0.01, 'expected import lane scale drag');
  });

  return { passed, failed };
}

export function runAgent15ModuleSelfTests(): { passed: number; failed: string[]; total: number } {
  const r = runAgent15GlobalTradeLinkageSelfTests();
  return { ...r, total: r.passed + r.failed.length };
}
