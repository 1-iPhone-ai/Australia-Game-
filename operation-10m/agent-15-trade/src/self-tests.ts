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
import { computeImportDependencySnapshot, createEmptyImportDependencySnapshot, importDependencyConsumerPressure } from './import-dependency.ts';
import { advanceDiplomaticEngagement, deriveEngagementPartnerModifiers } from './diplomatic-engagement.ts';
import { computeTradeFinanceSnapshot } from './trade-finance.ts';
import {
  computeMarketDiversificationSnapshot,
  deriveDiversificationPartnerModifiers,
} from './market-diversification.ts';
import { computeTermsOfTradeSnapshot, termsOfTradeHouseholdModifier } from './terms-of-trade.ts';
import {
  computeSupplyChainResilienceSnapshot,
  createEmptySupplyChainResilienceSnapshot,
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
  createEmptyPreferentialUtilizationSnapshot,
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
  createEmptyExportInsuranceStackSnapshot,
  exportInsuranceStackExportScale,
} from './export-credit-insurance-stack.ts';
import {
  computePartnerAccessRestorationSnapshot,
  createEmptyPartnerAccessRestorationSnapshot,
  deriveAccessRestorationPartnerModifiers,
} from './partner-access-restoration.ts';
import {
  computeSanctionsSpilloverSnapshot,
  deriveSanctionsSpilloverPartnerModifiers,
  sanctionsSpilloverExportScale,
} from './sanctions-spillover-depth.ts';
import {
  computeTradeCorridorResilienceSnapshot,
  createEmptyTradeCorridorResilienceSnapshot,
  tradeCorridorExportScale,
} from './trade-corridor-resilience.ts';
import {
  computeTradeFxHedgingSnapshot,
  createEmptyTradeFxHedgingSnapshot,
  tradeFxHedgingExportScale,
} from './trade-fx-hedging.ts';
import {
  computeImportLanePressureSnapshot,
  createEmptyImportLanePressureSnapshot,
  importLanePressureExportScale,
} from './import-lane-pressure.ts';
import {
  computeDiplomaticTradeCoherenceSnapshot,
  createEmptyDiplomaticTradeCoherenceSnapshot,
  diplomaticTradeCoherenceExportScale,
} from './diplomatic-trade-coherence.ts';
import {
  computeTradeBalanceStabilizationSnapshot,
  tradeBalanceStabilizationExportScale,
} from './trade-balance-stabilization.ts';
import {
  computeTradeCommitmentPipelineSnapshot,
  createEmptyTradeCommitmentPipelineSnapshot,
  exportCommitmentPipelineExportScale,
} from './export-commitment-pipeline.ts';
import {
  computeTradeShockAbsorptionSnapshot,
  createEmptyTradeShockAbsorptionSnapshot,
  tradeShockAbsorptionExportScale,
} from './trade-shock-absorption.ts';
import {
  computeImportCommitmentPipelineSnapshot,
  createEmptyImportCommitmentPipelineSnapshot,
  importCommitmentPipelineExportScale,
} from './import-commitment-pipeline.ts';
import {
  computeTradeFlowCohesionSnapshot,
  createEmptyTradeFlowCohesionSnapshot,
  tradeFlowCohesionExportScale,
} from './trade-flow-cohesion.ts';
import {
  computeTradeThroughputOrchestrationSnapshot,
  createEmptyTradeThroughputOrchestrationSnapshot,
  tradeThroughputOrchestrationExportScale,
} from './trade-throughput-orchestration.ts';
import {
  computeCommitmentLedgerHarmonizationSnapshot,
  createEmptyCommitmentLedgerHarmonizationSnapshot,
  commitmentLedgerHarmonizationExportScale,
} from './commitment-ledger-harmonization.ts';
import {
  computeBilateralCargoSchedulingSnapshot,
  createEmptyBilateralCargoSchedulingSnapshot,
  bilateralCargoSchedulingExportScale,
} from './bilateral-cargo-scheduling.ts';
import {
  computeCommitmentTurnCloseoutSnapshot,
  createEmptyCommitmentTurnCloseoutSnapshot,
  commitmentTurnCloseoutExportScale,
} from './commitment-turn-closeout.ts';
import {
  computeForwardSlotRolloverSnapshot,
  createEmptyForwardSlotRolloverSnapshot,
  forwardSlotRolloverExportScale,
} from './forward-slot-rollover.ts';
import {
  computeBilateralSettlementReconciliationSnapshot,
  createEmptyBilateralSettlementReconciliationSnapshot,
  bilateralSettlementReconciliationExportScale,
} from './bilateral-settlement-reconciliation.ts';
import {
  computeTradeSettlementContinuitySnapshot,
  createEmptyTradeSettlementContinuitySnapshot,
  tradeSettlementContinuityExportScale,
} from './trade-settlement-continuity.ts';
import {
  computeForwardBookAnchorStabilizationSnapshot,
  createEmptyForwardBookAnchorStabilizationSnapshot,
  forwardBookAnchorStabilizationExportScale,
} from './forward-book-anchor-stabilization.ts';
import {
  computeAnchoredBookReadinessSnapshot,
  createEmptyAnchoredBookReadinessSnapshot,
  anchoredBookReadinessExportScale,
} from './anchored-book-readiness.ts';
import {
  computeBilateralThroughputCertificationSnapshot,
  createEmptyBilateralThroughputCertificationSnapshot,
  bilateralThroughputCertificationExportScale,
} from './bilateral-throughput-certification.ts';
import {
  computeCertifiedThroughputSustainmentSnapshot,
  createEmptyCertifiedThroughputSustainmentSnapshot,
  certifiedThroughputSustainmentExportScale,
} from './certified-throughput-sustainment.ts';
import {
  computeBilateralCapacityHandoffGateSnapshot,
  createEmptyBilateralCapacityHandoffGateSnapshot,
  bilateralCapacityHandoffGateExportScale,
} from './bilateral-capacity-handoff-gate.ts';
import {
  computeCapacityHandoffAbsorptionSnapshot,
  createEmptyCapacityHandoffAbsorptionSnapshot,
  capacityHandoffAbsorptionExportScale,
} from './capacity-handoff-absorption.ts';
import {
  computeBilateralTradeWindowContinuitySnapshot,
  createEmptyBilateralTradeWindowContinuitySnapshot,
  bilateralTradeWindowContinuityExportScale,
} from './bilateral-trade-window-continuity.ts';
import {
  computeTradeCycleSealVerificationSnapshot,
  createEmptyTradeCycleSealVerificationSnapshot,
  tradeCycleSealVerificationExportScale,
} from './trade-cycle-seal-verification.ts';
import {
  computeBilateralCapacityRenewalGateSnapshot,
  createEmptyBilateralCapacityRenewalGateSnapshot,
  bilateralCapacityRenewalGateExportScale,
} from './bilateral-capacity-renewal-gate.ts';
import {
  computeCapacityRenewalPrimingSnapshot,
  createEmptyCapacityRenewalPrimingSnapshot,
  capacityRenewalPrimingExportScale,
} from './capacity-renewal-priming.ts';
import {
  computeBilateralCycleReentryGateSnapshot,
  createEmptyBilateralCycleReentryGateSnapshot,
  bilateralCycleReentryGateExportScale,
} from './bilateral-cycle-reentry-gate.ts';
import {
  computeCycleReentryStabilizationSnapshot,
  createEmptyCycleReentryStabilizationSnapshot,
  cycleReentryStabilizationExportScale,
} from './cycle-reentry-stabilization.ts';
import {
  computeBilateralLoopResumptionGateSnapshot,
  createEmptyBilateralLoopResumptionGateSnapshot,
  bilateralLoopResumptionGateExportScale,
} from './bilateral-loop-resumption-gate.ts';
import {
  computeResumedLoopContinuitySnapshot,
  createEmptyResumedLoopContinuitySnapshot,
  resumedLoopContinuityExportScale,
} from './resumed-loop-continuity.ts';
import {
  computeBilateralCycleRestartAcknowledgmentSnapshot,
  createEmptyBilateralCycleRestartAcknowledgmentSnapshot,
  bilateralCycleRestartAcknowledgmentExportScale,
} from './bilateral-cycle-restart-acknowledgment.ts';
import {
  computeAcknowledgedCyclePrimingSnapshot,
  createEmptyAcknowledgedCyclePrimingSnapshot,
  acknowledgedCyclePrimingExportScale,
} from './acknowledged-cycle-priming.ts';
import {
  computeBilateralCommitmentArcOpeningSnapshot,
  createEmptyBilateralCommitmentArcOpeningSnapshot,
  bilateralCommitmentArcOpeningExportScale,
} from './bilateral-commitment-arc-opening.ts';
import {
  computeCommitmentArcContinuitySnapshot,
  createEmptyCommitmentArcContinuitySnapshot,
  commitmentArcContinuityExportScale,
} from './commitment-arc-continuity.ts';
import {
  computeBilateralForwardCommitmentAdmissionSnapshot,
  createEmptyBilateralForwardCommitmentAdmissionSnapshot,
  bilateralForwardCommitmentAdmissionExportScale,
} from './bilateral-forward-commitment-admission.ts';
import {
  computeAdmittedForwardCommitmentContinuitySnapshot,
  createEmptyAdmittedForwardCommitmentContinuitySnapshot,
  admittedForwardCommitmentContinuityExportScale,
} from './admitted-forward-commitment-continuity.ts';
import {
  computeBilateralCommitmentWindowHandoffSnapshot,
  createEmptyBilateralCommitmentWindowHandoffSnapshot,
  bilateralCommitmentWindowHandoffExportScale,
} from './bilateral-commitment-window-handoff.ts';
import {
  computeBilateralTradeWindowContinuitySnapshot,
  createEmptyBilateralTradeWindowContinuitySnapshot,
} from './bilateral-trade-window-continuity.ts';
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

  ok('diplomatic trade coherence rises with aligned tracks', () => {
    const fragmented = computeDiplomaticTradeCoherenceSnapshot({
      engagement: { tracks: {}, summitPulse: 0.1, summary: 'test' },
      tradeDeescalation: createEmptyTradeDeescalationSnapshot(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      partnerAccessRestoration: createEmptyPartnerAccessRestorationSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const aligned = computeDiplomaticTradeCoherenceSnapshot({
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.8, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.82,
        summary: 'test',
      },
      tradeDeescalation: { ...createEmptyTradeDeescalationSnapshot(), band: 'breakthrough', momentum: 0.76 },
      tradeReconciliation: { ...createEmptyTradeReconciliationSnapshot(), band: 'settled', progress: 0.82 },
      partnerAccessRestoration: { ...createEmptyPartnerAccessRestorationSnapshot(), band: 'reopened', momentum: 0.74 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(aligned.score > fragmented.score, 'expected higher coherence');
    gtelAssert(diplomaticTradeCoherenceExportScale(aligned) >= diplomaticTradeCoherenceExportScale(fragmented), 'expected coherence scale lift');
  });

  ok('trade balance stabilization weakens under deficit and impaired insurance', () => {
    const anchored = computeTradeBalanceStabilizationSnapshot({
      tradeBalance: {
        exportValueIndex: 110,
        importPressureIndex: 90,
        netExportPulse: 0.12,
        currentAccountTone: 'surplus',
        effectiveThroughput: 100,
        narrative: 'test',
      },
      termsOfTrade: { index: 1.05, band: 'favorable', exportBasketIndex: 106, importBasketIndex: 98, summary: 'test' },
      tradeFxHedging: { ...createEmptyTradeFxHedgingSnapshot(), band: 'well_hedged', effectiveness: 0.78 },
      exportInsuranceStack: { ...createEmptyExportInsuranceStackSnapshot(), band: 'robust', compositeScore: 0.76 },
      tradeReconciliation: { ...createEmptyTradeReconciliationSnapshot(), band: 'settled', progress: 0.8 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const unstable = computeTradeBalanceStabilizationSnapshot({
      tradeBalance: {
        exportValueIndex: 92,
        importPressureIndex: 118,
        netExportPulse: -0.08,
        currentAccountTone: 'deficit',
        effectiveThroughput: 80,
        narrative: 'test',
      },
      termsOfTrade: { index: 0.84, band: 'severely_unfavorable', exportBasketIndex: 88, importBasketIndex: 112, summary: 'test' },
      tradeFxHedging: { ...createEmptyTradeFxHedgingSnapshot(), band: 'unhedged', effectiveness: 0.28 },
      exportInsuranceStack: { ...createEmptyExportInsuranceStackSnapshot(), band: 'impaired', compositeScore: 0.32 },
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: { ...createEmptyGTELPersisted(), tradeBalanceStabilizationSmoothing: 0.34 },
    }).snapshot;
    gtelAssert(unstable.index < anchored.index, 'expected weaker stabilization');
    gtelAssert(tradeBalanceStabilizationExportScale(unstable) <= tradeBalanceStabilizationExportScale(anchored) + 0.01, 'expected stabilization scale drag');
  });

  ok('trade shock absorption deepens with robust insurance and resilience', () => {
    const thin = computeTradeShockAbsorptionSnapshot({
      supplyChainResilience: { score: 0.32, band: 'brittle', chokepointCount: 4, redundancyIndex: 0.22, summary: 'test' },
      tradeFxHedging: createEmptyTradeFxHedgingSnapshot(),
      exportInsuranceStack: createEmptyExportInsuranceStackSnapshot(),
      diplomaticTradeCoherence: createEmptyDiplomaticTradeCoherenceSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const deep = computeTradeShockAbsorptionSnapshot({
      supplyChainResilience: { score: 0.78, band: 'robust', chokepointCount: 1, redundancyIndex: 0.72, summary: 'test' },
      tradeFxHedging: { ...createEmptyTradeFxHedgingSnapshot(), band: 'well_hedged', effectiveness: 0.8 },
      exportInsuranceStack: { ...createEmptyExportInsuranceStackSnapshot(), band: 'robust', compositeScore: 0.76 },
      diplomaticTradeCoherence: { ...createEmptyDiplomaticTradeCoherenceSnapshot(), band: 'aligned', score: 0.76 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(deep.capacity > thin.capacity, 'expected deeper shock absorption');
    gtelAssert(tradeShockAbsorptionExportScale(deep) >= tradeShockAbsorptionExportScale(thin), 'expected absorption scale lift');
  });

  ok('export commitment pipeline fills under saturated capacity and strong finance', () => {
    const slack = computeTradeCommitmentPipelineSnapshot({
      exportCapacity: createEmptyExportCapacitySnapshot(),
      preferentialUtilization: createEmptyPreferentialUtilizationSnapshot(),
      tradeFinance: createEmptyTradeFinanceSnapshot(),
      tradeCorridorResilience: createEmptyTradeCorridorResilienceSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const booked = computeTradeCommitmentPipelineSnapshot({
      exportCapacity: { ...createEmptyExportCapacitySnapshot(), band: 'saturated', utilization: 0.94, allocationEfficiency: 0.82 },
      preferentialUtilization: { ...createEmptyPreferentialUtilizationSnapshot(), band: 'high', utilizationRate: 0.72, activeAgreementCount: 2, boostedCommodities: ['coal'] },
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.82, band: 'fluid' },
      tradeCorridorResilience: { ...createEmptyTradeCorridorResilienceSnapshot(), score: 0.68, band: 'stable' },
      persisted: { ...createEmptyGTELPersisted(), exportCommitmentPipelineSmoothing: 0.72 },
    }).snapshot;
    gtelAssert(booked.fillRate > slack.fillRate, 'expected higher pipeline fill');
    gtelAssert(exportCommitmentPipelineExportScale(booked) <= exportCommitmentPipelineExportScale(slack) + 0.05, 'booked_out may drag scale');
  });

  ok('import commitment pipeline fills under critical dependency and congested lanes', () => {
    const slack = computeImportCommitmentPipelineSnapshot({
      importDependency: createEmptyImportDependencySnapshot(),
      importLanePressure: createEmptyImportLanePressureSnapshot(),
      tradeFinance: createEmptyTradeFinanceSnapshot(),
      supplyChainResilience: createEmptySupplyChainResilienceSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const booked = computeImportCommitmentPipelineSnapshot({
      importDependency: { ...createEmptyImportDependencySnapshot(), band: 'critical', score: 0.82 },
      importLanePressure: { ...createEmptyImportLanePressureSnapshot(), band: 'congested', load: 0.62 },
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.78, band: 'fluid' },
      supplyChainResilience: { ...createEmptySupplyChainResilienceSnapshot(), score: 0.7, band: 'robust', redundancyIndex: 0.65 },
      persisted: { ...createEmptyGTELPersisted(), importCommitmentPipelineSmoothing: 0.7 },
    }).snapshot;
    gtelAssert(booked.fillRate > slack.fillRate, 'expected higher import pipeline fill');
    gtelAssert(importCommitmentPipelineExportScale(booked) <= importCommitmentPipelineExportScale(slack) + 0.06, 'booked_out may drag scale');
  });

  ok('trade flow cohesion improves when export and import books align', () => {
    const exportPipe = { ...createEmptyTradeCommitmentPipelineSnapshot(), fillRate: 0.55, band: 'steady' as const };
    const importPipe = { ...createEmptyImportCommitmentPipelineSnapshot(), fillRate: 0.54, band: 'steady' as const };
    const aligned = computeTradeFlowCohesionSnapshot({
      exportCommitmentPipeline: exportPipe,
      importCommitmentPipeline: importPipe,
      tradeBalanceStabilization: { index: 0.68, band: 'anchored', surplusSupport: 0.12, volatilityDampening: 0.1, summary: 'test' },
      tradeShockAbsorption: { ...createEmptyTradeShockAbsorptionSnapshot(), band: 'deep', capacity: 0.76 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const skewed = computeTradeFlowCohesionSnapshot({
      exportCommitmentPipeline: { ...exportPipe, fillRate: 0.82, band: 'booked_out' },
      importCommitmentPipeline: { ...importPipe, fillRate: 0.38, band: 'slack' },
      tradeBalanceStabilization: { index: 0.42, band: 'unstable', surplusSupport: -0.04, volatilityDampening: 0.02, summary: 'test' },
      tradeShockAbsorption: { ...createEmptyTradeShockAbsorptionSnapshot(), band: 'exhausted', capacity: 0.28 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(aligned.score > skewed.score, 'expected stronger cohesion when aligned');
    gtelAssert(tradeFlowCohesionExportScale(aligned) >= tradeFlowCohesionExportScale(skewed), 'expected cohesion scale lift');
  });

  ok('trade throughput orchestration lifts under fluid logistics and aligned pipelines', () => {
    const exportPipe = { ...createEmptyTradeCommitmentPipelineSnapshot(), fillRate: 0.48, band: 'steady' as const };
    const importPipe = { ...createEmptyImportCommitmentPipelineSnapshot(), fillRate: 0.46, band: 'steady' as const };
    const cohesion = { ...createEmptyTradeFlowCohesionSnapshot(), score: 0.68, band: 'synchronized' as const };
    const fluid = computeTradeThroughputOrchestrationSnapshot({
      exportCommitmentPipeline: exportPipe,
      importCommitmentPipeline: importPipe,
      tradeFlowCohesion: cohesion,
      logistics: { band: 'fluid', freightPressure: 0.2, redundancyScore: 0.7, effectiveExportThroughput: 100, networkStrain: 0.1, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const congested = computeTradeThroughputOrchestrationSnapshot({
      exportCommitmentPipeline: { ...exportPipe, fillRate: 0.82, band: 'booked_out' },
      importCommitmentPipeline: { ...importPipe, fillRate: 0.8, band: 'booked_out' },
      tradeFlowCohesion: { ...cohesion, score: 0.32, band: 'dislocated' },
      logistics: { band: 'congested', freightPressure: 0.72, redundancyScore: 0.3, effectiveExportThroughput: 60, networkStrain: 0.6, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(fluid.score > congested.score, 'expected stronger orchestration when fluid');
    gtelAssert(
      tradeThroughputOrchestrationExportScale(fluid) >= tradeThroughputOrchestrationExportScale(congested),
      'expected orchestration scale lift',
    );
  });

  ok('commitment ledger harmonization improves when finance coverage aligns', () => {
    const exportPipe = { ...createEmptyTradeCommitmentPipelineSnapshot(), financeCoverage: 0.72, fillRate: 0.55 };
    const importPipe = { ...createEmptyImportCommitmentPipelineSnapshot(), financeCoverage: 0.7, fillRate: 0.54 };
    const cohesion = { ...createEmptyTradeFlowCohesionSnapshot(), score: 0.62, band: 'balanced' as const };
    const orchestration = { ...createEmptyTradeThroughputOrchestrationSnapshot(), score: 0.66, band: 'fluid' as const };
    const aligned = computeCommitmentLedgerHarmonizationSnapshot({
      exportCommitmentPipeline: exportPipe,
      importCommitmentPipeline: importPipe,
      tradeFlowCohesion: cohesion,
      tradeThroughputOrchestration: orchestration,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const fractured = computeCommitmentLedgerHarmonizationSnapshot({
      exportCommitmentPipeline: { ...exportPipe, financeCoverage: 0.82 },
      importCommitmentPipeline: { ...importPipe, financeCoverage: 0.38 },
      tradeFlowCohesion: { ...cohesion, score: 0.34, band: 'dislocated' },
      tradeThroughputOrchestration: { ...orchestration, score: 0.28, band: 'stalled' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(aligned.score > fractured.score, 'expected stronger harmonization when aligned');
    gtelAssert(
      commitmentLedgerHarmonizationExportScale(aligned) >= commitmentLedgerHarmonizationExportScale(fractured),
      'expected harmonization scale lift',
    );
  });

  ok('bilateral cargo scheduling improves when ledgers align and logistics are fluid', () => {
    const harmonization = { ...createEmptyCommitmentLedgerHarmonizationSnapshot(), score: 0.72, band: 'aligned' as const, ledgerGap: 0.06 };
    const orchestration = { ...createEmptyTradeThroughputOrchestrationSnapshot(), score: 0.68, band: 'fluid' as const, pipelineHeadroom: 0.42 };
    const onSchedule = computeBilateralCargoSchedulingSnapshot({
      commitmentLedgerHarmonization: harmonization,
      tradeThroughputOrchestration: orchestration,
      logistics: { band: 'fluid', freightPressure: 0.18, redundancyScore: 0.72, effectiveExportThroughput: 95, networkStrain: 0.08, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const gridlocked = computeBilateralCargoSchedulingSnapshot({
      commitmentLedgerHarmonization: { ...harmonization, score: 0.32, band: 'fractured', ledgerGap: 0.34 },
      tradeThroughputOrchestration: { ...orchestration, score: 0.26, band: 'stalled', pipelineHeadroom: 0.1 },
      logistics: { band: 'congested', freightPressure: 0.78, redundancyScore: 0.28, effectiveExportThroughput: 52, networkStrain: 0.65, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(onSchedule.score > gridlocked.score, 'expected stronger scheduling when aligned');
    gtelAssert(
      bilateralCargoSchedulingExportScale(onSchedule) >= bilateralCargoSchedulingExportScale(gridlocked),
      'expected scheduling scale lift',
    );
  });

  ok('commitment turn closeout improves when cargo scheduling is on schedule', () => {
    const exportPipe = { ...createEmptyTradeCommitmentPipelineSnapshot(), fillRate: 0.52, band: 'steady' as const };
    const importPipe = { ...createEmptyImportCommitmentPipelineSnapshot(), fillRate: 0.5, band: 'steady' as const };
    const harmonization = { ...createEmptyCommitmentLedgerHarmonizationSnapshot(), score: 0.7, band: 'aligned' as const };
    const scheduling = { ...createEmptyBilateralCargoSchedulingSnapshot(), score: 0.74, band: 'on_schedule' as const };
    const clean = computeCommitmentTurnCloseoutSnapshot({
      exportCommitmentPipeline: exportPipe,
      importCommitmentPipeline: importPipe,
      commitmentLedgerHarmonization: harmonization,
      bilateralCargoScheduling: scheduling,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const unsettled = computeCommitmentTurnCloseoutSnapshot({
      exportCommitmentPipeline: { ...exportPipe, fillRate: 0.82, band: 'booked_out' },
      importCommitmentPipeline: { ...importPipe, fillRate: 0.38, band: 'slack' },
      commitmentLedgerHarmonization: { ...harmonization, score: 0.34, band: 'fractured' },
      bilateralCargoScheduling: { ...scheduling, score: 0.28, band: 'gridlocked' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(clean.score > unsettled.score, 'expected stronger closeout when on schedule');
    gtelAssert(
      commitmentTurnCloseoutExportScale(clean) >= commitmentTurnCloseoutExportScale(unsettled),
      'expected closeout scale lift',
    );
  });

  ok('forward slot rollover improves when closeout is clean', () => {
    const exportPipe = { ...createEmptyTradeCommitmentPipelineSnapshot(), fillRate: 0.51, band: 'steady' as const };
    const importPipe = { ...createEmptyImportCommitmentPipelineSnapshot(), fillRate: 0.5, band: 'steady' as const };
    const closeout = { ...createEmptyCommitmentTurnCloseoutSnapshot(), score: 0.76, band: 'closed_clean' as const, slotVariance: 0.06 };
    const seamless = computeForwardSlotRolloverSnapshot({
      exportCommitmentPipeline: exportPipe,
      importCommitmentPipeline: importPipe,
      commitmentTurnCloseout: closeout,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const blocked = computeForwardSlotRolloverSnapshot({
      exportCommitmentPipeline: { ...exportPipe, fillRate: 0.84, band: 'booked_out' },
      importCommitmentPipeline: { ...importPipe, fillRate: 0.36, band: 'slack' },
      commitmentTurnCloseout: { ...closeout, score: 0.3, band: 'unsettled', slotVariance: 0.38 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(seamless.score > blocked.score, 'expected stronger rollover when closeout clean');
    gtelAssert(
      forwardSlotRolloverExportScale(seamless) >= forwardSlotRolloverExportScale(blocked),
      'expected rollover scale lift',
    );
  });

  ok('bilateral settlement reconciliation improves when rollover and scheduling align', () => {
    const rollover = { ...createEmptyForwardSlotRolloverSnapshot(), score: 0.74, band: 'seamless' as const, openSlotCarry: 0.1 };
    const scheduling = { ...createEmptyBilateralCargoSchedulingSnapshot(), score: 0.72, band: 'on_schedule' as const };
    const orchestration = { ...createEmptyTradeThroughputOrchestrationSnapshot(), score: 0.68, band: 'fluid' as const };
    const settled = computeBilateralSettlementReconciliationSnapshot({
      forwardSlotRollover: rollover,
      bilateralCargoScheduling: scheduling,
      tradeThroughputOrchestration: orchestration,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const unsettled = computeBilateralSettlementReconciliationSnapshot({
      forwardSlotRollover: { ...rollover, score: 0.28, band: 'blocked', openSlotCarry: 0.42 },
      bilateralCargoScheduling: { ...scheduling, score: 0.3, band: 'gridlocked' },
      tradeThroughputOrchestration: { ...orchestration, score: 0.26, band: 'stalled' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(settled.score > unsettled.score, 'expected stronger settlement when aligned');
    gtelAssert(
      bilateralSettlementReconciliationExportScale(settled) >= bilateralSettlementReconciliationExportScale(unsettled),
      'expected settlement scale lift',
    );
  });

  ok('trade settlement continuity improves when settlement is settled and rollover seamless', () => {
    const settlement = { ...createEmptyBilateralSettlementReconciliationSnapshot(), score: 0.76, band: 'settled' as const, rolloverAlignment: 0.72 };
    const rollover = { ...createEmptyForwardSlotRolloverSnapshot(), score: 0.74, band: 'seamless' as const, openSlotCarry: 0.1 };
    const anchored = computeTradeSettlementContinuitySnapshot({
      bilateralSettlementReconciliation: settlement,
      forwardSlotRollover: rollover,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const broken = computeTradeSettlementContinuitySnapshot({
      bilateralSettlementReconciliation: { ...settlement, score: 0.3, band: 'unsettled', rolloverAlignment: 0.28 },
      forwardSlotRollover: { ...rollover, score: 0.26, band: 'blocked', openSlotCarry: 0.44 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(anchored.score > broken.score, 'expected stronger continuity when settled');
    gtelAssert(
      tradeSettlementContinuityExportScale(anchored) >= tradeSettlementContinuityExportScale(broken),
      'expected continuity scale lift',
    );
  });

  ok('forward book anchor stabilization improves when continuity is anchored', () => {
    const continuity = { ...createEmptyTradeSettlementContinuitySnapshot(), score: 0.78, band: 'anchored' as const, settlementCarry: 0.12 };
    const harmonization = { ...createEmptyCommitmentLedgerHarmonizationSnapshot(), score: 0.72, band: 'aligned' as const };
    const locked = computeForwardBookAnchorStabilizationSnapshot({
      tradeSettlementContinuity: continuity,
      commitmentLedgerHarmonization: harmonization,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const unmoored = computeForwardBookAnchorStabilizationSnapshot({
      tradeSettlementContinuity: { ...continuity, score: 0.28, band: 'broken', settlementCarry: 0.48 },
      commitmentLedgerHarmonization: { ...harmonization, score: 0.32, band: 'fractured' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(locked.score > unmoored.score, 'expected stronger anchor when continuity anchored');
    gtelAssert(
      forwardBookAnchorStabilizationExportScale(locked) >= forwardBookAnchorStabilizationExportScale(unmoored),
      'expected anchor scale lift',
    );
  });

  ok('anchored book readiness improves when anchors are locked and continuity anchored', () => {
    const anchor = { ...createEmptyForwardBookAnchorStabilizationSnapshot(), score: 0.78, band: 'locked' as const };
    const continuity = { ...createEmptyTradeSettlementContinuitySnapshot(), score: 0.76, band: 'anchored' as const };
    const orchestration = { ...createEmptyTradeThroughputOrchestrationSnapshot(), score: 0.7, band: 'fluid' as const };
    const ready = computeAnchoredBookReadinessSnapshot({
      forwardBookAnchorStabilization: anchor,
      tradeSettlementContinuity: continuity,
      tradeThroughputOrchestration: orchestration,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const blocked = computeAnchoredBookReadinessSnapshot({
      forwardBookAnchorStabilization: { ...anchor, score: 0.28, band: 'unmoored' },
      tradeSettlementContinuity: { ...continuity, score: 0.26, band: 'broken' },
      tradeThroughputOrchestration: { ...orchestration, score: 0.24, band: 'stalled' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(ready.score > blocked.score, 'expected stronger readiness when locked');
    gtelAssert(
      anchoredBookReadinessExportScale(ready) >= anchoredBookReadinessExportScale(blocked),
      'expected readiness scale lift',
    );
  });

  ok('bilateral throughput certification improves when book readiness is ready', () => {
    const readiness = { ...createEmptyAnchoredBookReadinessSnapshot(), score: 0.8, band: 'ready' as const };
    const certified = computeBilateralThroughputCertificationSnapshot({
      anchoredBookReadiness: readiness,
      logistics: { band: 'fluid', freightPressure: 0.18, redundancyScore: 0.74, effectiveExportThroughput: 95, networkStrain: 0.08, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const rejected = computeBilateralThroughputCertificationSnapshot({
      anchoredBookReadiness: { ...readiness, score: 0.26, band: 'blocked' },
      logistics: { band: 'congested', freightPressure: 0.8, redundancyScore: 0.26, effectiveExportThroughput: 48, networkStrain: 0.68, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(certified.score > rejected.score, 'expected stronger certification when ready');
    gtelAssert(
      bilateralThroughputCertificationExportScale(certified) >= bilateralThroughputCertificationExportScale(rejected),
      'expected certification scale lift',
    );
  });

  ok('certified throughput sustainment improves when certification is certified', () => {
    const certification = { ...createEmptyBilateralThroughputCertificationSnapshot(), score: 0.82, band: 'certified' as const, readinessSupport: 0.14 };
    const anchor = { ...createEmptyForwardBookAnchorStabilizationSnapshot(), score: 0.76, band: 'locked' as const };
    const sustained = computeCertifiedThroughputSustainmentSnapshot({
      bilateralThroughputCertification: certification,
      forwardBookAnchorStabilization: anchor,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const exhausted = computeCertifiedThroughputSustainmentSnapshot({
      bilateralThroughputCertification: { ...certification, score: 0.24, band: 'rejected', readinessSupport: -0.08 },
      forwardBookAnchorStabilization: { ...anchor, score: 0.22, band: 'unmoored' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(sustained.score > exhausted.score, 'expected stronger sustainment when certified');
    gtelAssert(
      certifiedThroughputSustainmentExportScale(sustained) >= certifiedThroughputSustainmentExportScale(exhausted),
      'expected sustainment scale lift',
    );
  });

  ok('bilateral capacity handoff gate opens when sustainment is sustained and readiness ready', () => {
    const sustainment = { ...createEmptyCertifiedThroughputSustainmentSnapshot(), score: 0.84, band: 'sustained' as const };
    const readiness = { ...createEmptyAnchoredBookReadinessSnapshot(), score: 0.8, band: 'ready' as const };
    const open = computeBilateralCapacityHandoffGateSnapshot({
      certifiedThroughputSustainment: sustainment,
      anchoredBookReadiness: readiness,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const closed = computeBilateralCapacityHandoffGateSnapshot({
      certifiedThroughputSustainment: { ...sustainment, score: 0.26, band: 'exhausted' },
      anchoredBookReadiness: { ...readiness, score: 0.24, band: 'blocked' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(open.score > closed.score, 'expected open handoff when sustained');
    gtelAssert(
      bilateralCapacityHandoffGateExportScale(open) >= bilateralCapacityHandoffGateExportScale(closed),
      'expected handoff scale lift',
    );
  });

  ok('capacity handoff absorption improves when handoff gate is open', () => {
    const gate = { ...createEmptyBilateralCapacityHandoffGateSnapshot(), score: 0.84, band: 'open' as const, readinessLift: 0.12 };
    const sustainment = { ...createEmptyCertifiedThroughputSustainmentSnapshot(), score: 0.8, band: 'sustained' as const };
    const absorbed = computeCapacityHandoffAbsorptionSnapshot({
      bilateralCapacityHandoffGate: gate,
      certifiedThroughputSustainment: sustainment,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const rejected = computeCapacityHandoffAbsorptionSnapshot({
      bilateralCapacityHandoffGate: { ...gate, score: 0.24, band: 'closed', readinessLift: -0.08 },
      certifiedThroughputSustainment: { ...sustainment, score: 0.22, band: 'exhausted' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(absorbed.score > rejected.score, 'expected stronger absorption when open');
    gtelAssert(
      capacityHandoffAbsorptionExportScale(absorbed) >= capacityHandoffAbsorptionExportScale(rejected),
      'expected absorption scale lift',
    );
  });

  ok('bilateral trade window continuity improves when absorption is absorbed', () => {
    const absorption = { ...createEmptyCapacityHandoffAbsorptionSnapshot(), score: 0.85, band: 'absorbed' as const };
    const readiness = { ...createEmptyAnchoredBookReadinessSnapshot(), score: 0.82, band: 'ready' as const };
    const continuous = computeBilateralTradeWindowContinuitySnapshot({
      capacityHandoffAbsorption: absorption,
      anchoredBookReadiness: readiness,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const severed = computeBilateralTradeWindowContinuitySnapshot({
      capacityHandoffAbsorption: { ...absorption, score: 0.24, band: 'rejected' },
      anchoredBookReadiness: { ...readiness, score: 0.22, band: 'blocked' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(continuous.score > severed.score, 'expected stronger continuity when absorbed');
    gtelAssert(
      bilateralTradeWindowContinuityExportScale(continuous) >= bilateralTradeWindowContinuityExportScale(severed),
      'expected window continuity scale lift',
    );
  });

  ok('trade cycle seal verification improves when window continuity is continuous', () => {
    const continuity = { ...createEmptyBilateralTradeWindowContinuitySnapshot(), score: 0.86, band: 'continuous' as const, absorptionSupport: 0.14 };
    const sustainment = { ...createEmptyCertifiedThroughputSustainmentSnapshot(), score: 0.82, band: 'sustained' as const };
    const verified = computeTradeCycleSealVerificationSnapshot({
      bilateralTradeWindowContinuity: continuity,
      certifiedThroughputSustainment: sustainment,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const failed = computeTradeCycleSealVerificationSnapshot({
      bilateralTradeWindowContinuity: { ...continuity, score: 0.22, band: 'severed', absorptionSupport: -0.08 },
      certifiedThroughputSustainment: { ...sustainment, score: 0.2, band: 'exhausted' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(verified.score > failed.score, 'expected stronger seal when continuous');
    gtelAssert(
      tradeCycleSealVerificationExportScale(verified) >= tradeCycleSealVerificationExportScale(failed),
      'expected seal scale lift',
    );
  });

  ok('bilateral capacity renewal gate opens when cycle seal is verified', () => {
    const seal = { ...createEmptyTradeCycleSealVerificationSnapshot(), score: 0.87, band: 'verified' as const };
    const readiness = { ...createEmptyAnchoredBookReadinessSnapshot(), score: 0.84, band: 'ready' as const };
    const renewed = computeBilateralCapacityRenewalGateSnapshot({
      tradeCycleSealVerification: seal,
      anchoredBookReadiness: readiness,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const blocked = computeBilateralCapacityRenewalGateSnapshot({
      tradeCycleSealVerification: { ...seal, score: 0.22, band: 'failed' },
      anchoredBookReadiness: { ...readiness, score: 0.2, band: 'blocked' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(renewed.score > blocked.score, 'expected renewal when verified');
    gtelAssert(
      bilateralCapacityRenewalGateExportScale(renewed) >= bilateralCapacityRenewalGateExportScale(blocked),
      'expected renewal scale lift',
    );
  });

  ok('capacity renewal priming improves when renewal gate is renewed', () => {
    const gate = { ...createEmptyBilateralCapacityRenewalGateSnapshot(), score: 0.88, band: 'renewed' as const, readinessLift: 0.12 };
    const sustainment = { ...createEmptyCertifiedThroughputSustainmentSnapshot(), score: 0.82, band: 'sustained' as const };
    const primed = computeCapacityRenewalPrimingSnapshot({
      bilateralCapacityRenewalGate: gate,
      certifiedThroughputSustainment: sustainment,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const starved = computeCapacityRenewalPrimingSnapshot({
      bilateralCapacityRenewalGate: { ...gate, score: 0.2, band: 'blocked', readinessLift: -0.08 },
      certifiedThroughputSustainment: { ...sustainment, score: 0.18, band: 'exhausted' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(primed.score > starved.score, 'expected stronger priming when renewed');
    gtelAssert(
      capacityRenewalPrimingExportScale(primed) >= capacityRenewalPrimingExportScale(starved),
      'expected priming scale lift',
    );
  });

  ok('bilateral cycle reentry gate opens when priming is primed and books ready', () => {
    const priming = { ...createEmptyCapacityRenewalPrimingSnapshot(), score: 0.89, band: 'primed' as const };
    const readiness = { ...createEmptyAnchoredBookReadinessSnapshot(), score: 0.86, band: 'ready' as const };
    const entered = computeBilateralCycleReentryGateSnapshot({
      capacityRenewalPriming: priming,
      anchoredBookReadiness: readiness,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const denied = computeBilateralCycleReentryGateSnapshot({
      capacityRenewalPriming: { ...priming, score: 0.2, band: 'starved' },
      anchoredBookReadiness: { ...readiness, score: 0.18, band: 'blocked' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(entered.score > denied.score, 'expected reentry when primed');
    gtelAssert(
      bilateralCycleReentryGateExportScale(entered) >= bilateralCycleReentryGateExportScale(denied),
      'expected reentry scale lift',
    );
  });

  ok('cycle reentry stabilization improves when reentry gate is entered', () => {
    const reentry = { ...createEmptyBilateralCycleReentryGateSnapshot(), score: 0.9, band: 'entered' as const, primingSupport: 0.14 };
    const seal = { ...createEmptyTradeCycleSealVerificationSnapshot(), score: 0.86, band: 'verified' as const };
    const stable = computeCycleReentryStabilizationSnapshot({
      bilateralCycleReentryGate: reentry,
      tradeCycleSealVerification: seal,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const volatile = computeCycleReentryStabilizationSnapshot({
      bilateralCycleReentryGate: { ...reentry, score: 0.18, band: 'denied', primingSupport: -0.08 },
      tradeCycleSealVerification: { ...seal, score: 0.16, band: 'failed' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(stable.score > volatile.score, 'expected stronger stabilization when entered');
    gtelAssert(
      cycleReentryStabilizationExportScale(stable) >= cycleReentryStabilizationExportScale(volatile),
      'expected stabilization scale lift',
    );
  });

  ok('bilateral loop resumption gate opens when stabilization is stable', () => {
    const stabilization = { ...createEmptyCycleReentryStabilizationSnapshot(), score: 0.91, band: 'stable' as const };
    const priming = { ...createEmptyCapacityRenewalPrimingSnapshot(), score: 0.88, band: 'primed' as const };
    const resumed = computeBilateralLoopResumptionGateSnapshot({
      cycleReentryStabilization: stabilization,
      capacityRenewalPriming: priming,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const closed = computeBilateralLoopResumptionGateSnapshot({
      cycleReentryStabilization: { ...stabilization, score: 0.16, band: 'volatile' },
      capacityRenewalPriming: { ...priming, score: 0.14, band: 'starved' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(resumed.score > closed.score, 'expected resumption when stable');
    gtelAssert(
      bilateralLoopResumptionGateExportScale(resumed) >= bilateralLoopResumptionGateExportScale(closed),
      'expected resumption scale lift',
    );
  });

  ok('resumed loop continuity improves when loop resumption gate is resumed', () => {
    const resumption = { ...createEmptyBilateralLoopResumptionGateSnapshot(), score: 0.92, band: 'resumed' as const };
    const stabilization = { ...createEmptyCycleReentryStabilizationSnapshot(), score: 0.88, band: 'stable' as const };
    const continuous = computeResumedLoopContinuitySnapshot({
      bilateralLoopResumptionGate: resumption,
      cycleReentryStabilization: stabilization,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const broken = computeResumedLoopContinuitySnapshot({
      bilateralLoopResumptionGate: { ...resumption, score: 0.14, band: 'closed' },
      cycleReentryStabilization: { ...stabilization, score: 0.12, band: 'volatile' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(continuous.score > broken.score, 'expected stronger continuity when resumed');
    gtelAssert(
      resumedLoopContinuityExportScale(continuous) >= resumedLoopContinuityExportScale(broken),
      'expected loop continuity scale lift',
    );
  });

  ok('bilateral cycle restart acknowledgment improves when loop continuity is continuous', () => {
    const continuity = { ...createEmptyResumedLoopContinuitySnapshot(), score: 0.93, band: 'continuous' as const };
    const readiness = { ...createEmptyAnchoredBookReadinessSnapshot(), score: 0.9, band: 'ready' as const };
    const acknowledged = computeBilateralCycleRestartAcknowledgmentSnapshot({
      resumedLoopContinuity: continuity,
      anchoredBookReadiness: readiness,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const rejected = computeBilateralCycleRestartAcknowledgmentSnapshot({
      resumedLoopContinuity: { ...continuity, score: 0.12, band: 'broken' },
      anchoredBookReadiness: { ...readiness, score: 0.1, band: 'blocked' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(acknowledged.score > rejected.score, 'expected acknowledgment when continuous');
    gtelAssert(
      bilateralCycleRestartAcknowledgmentExportScale(acknowledged) >=
        bilateralCycleRestartAcknowledgmentExportScale(rejected),
      'expected acknowledgment scale lift',
    );
  });

  ok('acknowledged cycle priming improves when restart is acknowledged', () => {
    const ack = { ...createEmptyBilateralCycleRestartAcknowledgmentSnapshot(), score: 0.94, band: 'acknowledged' as const };
    const priming = { ...createEmptyCapacityRenewalPrimingSnapshot(), score: 0.9, band: 'primed' as const };
    const primed = computeAcknowledgedCyclePrimingSnapshot({
      bilateralCycleRestartAcknowledgment: ack,
      capacityRenewalPriming: priming,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const empty = computeAcknowledgedCyclePrimingSnapshot({
      bilateralCycleRestartAcknowledgment: { ...ack, score: 0.1, band: 'rejected' },
      capacityRenewalPriming: { ...priming, score: 0.08, band: 'starved' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(primed.score > empty.score, 'expected stronger ack priming when acknowledged');
    gtelAssert(
      acknowledgedCyclePrimingExportScale(primed) >= acknowledgedCyclePrimingExportScale(empty),
      'expected ack priming scale lift',
    );
  });

  ok('bilateral commitment arc opening improves when cycle priming is primed', () => {
    const ackPriming = { ...createEmptyAcknowledgedCyclePrimingSnapshot(), score: 0.95, band: 'primed' as const };
    const readiness = { ...createEmptyAnchoredBookReadinessSnapshot(), score: 0.92, band: 'ready' as const };
    const opened = computeBilateralCommitmentArcOpeningSnapshot({
      acknowledgedCyclePriming: ackPriming,
      anchoredBookReadiness: readiness,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const sealed = computeBilateralCommitmentArcOpeningSnapshot({
      acknowledgedCyclePriming: { ...ackPriming, score: 0.1, band: 'empty' },
      anchoredBookReadiness: { ...readiness, score: 0.08, band: 'blocked' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(opened.score > sealed.score, 'expected arc open when primed');
    gtelAssert(
      bilateralCommitmentArcOpeningExportScale(opened) >= bilateralCommitmentArcOpeningExportScale(sealed),
      'expected arc opening scale lift',
    );
  });

  ok('commitment arc continuity improves when arc is opened and loop is continuous', () => {
    const arc = { ...createEmptyBilateralCommitmentArcOpeningSnapshot(), score: 0.95, band: 'opened' as const };
    const loop = { ...createEmptyResumedLoopContinuitySnapshot(), score: 0.94, band: 'continuous' as const };
    const sustained = computeCommitmentArcContinuitySnapshot({
      bilateralCommitmentArcOpening: arc,
      resumedLoopContinuity: loop,
      persisted: { ...createEmptyGTELPersisted(), commitmentArcContinuitySmoothing: 0.88 },
    }).snapshot;
    const lost = computeCommitmentArcContinuitySnapshot({
      bilateralCommitmentArcOpening: { ...arc, score: 0.12, band: 'sealed' },
      resumedLoopContinuity: { ...loop, score: 0.1, band: 'broken' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(sustained.score > lost.score, 'expected sustained arc continuity');
    gtelAssert(
      commitmentArcContinuityExportScale(sustained) >= commitmentArcContinuityExportScale(lost),
      'expected arc continuity scale lift',
    );
  });

  ok('bilateral forward commitment admission improves when continuity is sustained', () => {
    const continuity = {
      ...createEmptyCommitmentArcContinuitySnapshot(),
      score: 0.96,
      band: 'sustained' as const,
    };
    const arc = { ...createEmptyBilateralCommitmentArcOpeningSnapshot(), score: 0.94, band: 'opened' as const };
    const admitted = computeBilateralForwardCommitmentAdmissionSnapshot({
      commitmentArcContinuity: continuity,
      bilateralCommitmentArcOpening: arc,
      persisted: { ...createEmptyGTELPersisted(), bilateralForwardCommitmentAdmissionSmoothing: 0.9 },
    }).snapshot;
    const closed = computeBilateralForwardCommitmentAdmissionSnapshot({
      commitmentArcContinuity: { ...continuity, score: 0.11, band: 'lost' },
      bilateralCommitmentArcOpening: { ...arc, score: 0.08, band: 'sealed' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(admitted.score > closed.score, 'expected forward admission when sustained');
    gtelAssert(
      bilateralForwardCommitmentAdmissionExportScale(admitted) >=
        bilateralForwardCommitmentAdmissionExportScale(closed),
      'expected forward admission scale lift',
    );
  });

  ok('admitted forward commitment continuity improves when admission is admitted', () => {
    const admission = {
      ...createEmptyBilateralForwardCommitmentAdmissionSnapshot(),
      score: 0.95,
      band: 'admitted' as const,
    };
    const arc = { ...createEmptyCommitmentArcContinuitySnapshot(), score: 0.93, band: 'sustained' as const };
    const anchored = computeAdmittedForwardCommitmentContinuitySnapshot({
      bilateralForwardCommitmentAdmission: admission,
      commitmentArcContinuity: arc,
      persisted: { ...createEmptyGTELPersisted(), admittedForwardCommitmentContinuitySmoothing: 0.89 },
    }).snapshot;
    const revoked = computeAdmittedForwardCommitmentContinuitySnapshot({
      bilateralForwardCommitmentAdmission: { ...admission, score: 0.1, band: 'closed' },
      commitmentArcContinuity: { ...arc, score: 0.08, band: 'lost' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(anchored.score > revoked.score, 'expected anchored admitted continuity');
    gtelAssert(
      admittedForwardCommitmentContinuityExportScale(anchored) >=
        admittedForwardCommitmentContinuityExportScale(revoked),
      'expected admitted continuity scale lift',
    );
  });

  ok('bilateral commitment window handoff improves when continuity is anchored', () => {
    const admitted = {
      ...createEmptyAdmittedForwardCommitmentContinuitySnapshot(),
      score: 0.96,
      band: 'anchored' as const,
    };
    const window = { ...createEmptyBilateralTradeWindowContinuitySnapshot(), score: 0.92, band: 'continuous' as const };
    const handed = computeBilateralCommitmentWindowHandoffSnapshot({
      admittedForwardCommitmentContinuity: admitted,
      bilateralTradeWindowContinuity: window,
      persisted: { ...createEmptyGTELPersisted(), bilateralCommitmentWindowHandoffSmoothing: 0.91 },
    }).snapshot;
    const blocked = computeBilateralCommitmentWindowHandoffSnapshot({
      admittedForwardCommitmentContinuity: { ...admitted, score: 0.11, band: 'revoked' },
      bilateralTradeWindowContinuity: { ...window, score: 0.09, band: 'severed' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(handed.score > blocked.score, 'expected window handoff when anchored');
    gtelAssert(
      bilateralCommitmentWindowHandoffExportScale(handed) >= bilateralCommitmentWindowHandoffExportScale(blocked),
      'expected window handoff scale lift',
    );
  });

  return { passed, failed };
}

export function runAgent15ModuleSelfTests(): { passed: number; failed: string[]; total: number } {
  const r = runAgent15GlobalTradeLinkageSelfTests();
  return { ...r, total: r.passed + r.failed.length };
}
