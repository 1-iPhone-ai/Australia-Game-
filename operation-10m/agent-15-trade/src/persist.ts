import { GTEL_COMMODITIES, GTEL_LIMITS, GTEL_PARTNER_DEFS, GTEL_BASE_COMMODITY_INDEX } from './constants.ts';
import type { GTELAccessBand, GTELCommodityId, GTELPartnerId, GTELPersisted, PartnerSanctionRegime, TradeAgreementRecord } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';
import { sanitizePartnerSanctionRegime } from './sanctions.ts';
import { createEmptyTradeComplianceRecord, sanitizeTradeComplianceRecord } from './trade-compliance.ts';
import { sanitizeImportDependencySmoothing } from './import-dependency.ts';
import { sanitizePartnerMixSmoothing } from './market-diversification.ts';
import { sanitizeTradeFinanceSmoothing } from './trade-finance.ts';
import { sanitizeTermsOfTradeSmoothing } from './terms-of-trade.ts';
import { sanitizeSupplyChainResilienceSmoothing } from './supply-chain-resilience.ts';
import { sanitizeForeignExchangeSmoothing } from './foreign-exchange-pressure.ts';
import { sanitizeRetaliationPressureSmoothing } from './trade-retaliation.ts';
import { sanitizeDeescalationMomentumSmoothing } from './trade-deescalation.ts';
import { sanitizeExportCapacitySmoothing } from './export-capacity-allocation.ts';
import { sanitizeReconciliationProgressSmoothing } from './trade-reconciliation.ts';
import { sanitizeMaritimeRiskSmoothing } from './maritime-risk-premium.ts';
import { sanitizePreferentialUtilizationSmoothing } from './preferential-access-utilization.ts';
import { sanitizeEnforcementIntensitySmoothing } from './trade-enforcement-intensity.ts';
import { sanitizeExportInsuranceStackSmoothing } from './export-credit-insurance-stack.ts';
import { sanitizeAccessRestorationSmoothing } from './partner-access-restoration.ts';
import { sanitizeTradeCorridorSmoothing } from './trade-corridor-resilience.ts';
import { sanitizeSanctionsSpilloverSmoothing } from './sanctions-spillover-depth.ts';
import { sanitizeTradeFxHedgingSmoothing } from './trade-fx-hedging.ts';
import { sanitizeImportLanePressureSmoothing } from './import-lane-pressure.ts';
import { sanitizeDiplomaticTradeCoherenceSmoothing } from './diplomatic-trade-coherence.ts';
import { sanitizeTradeBalanceStabilizationSmoothing } from './trade-balance-stabilization.ts';
import { sanitizeTradeShockAbsorptionSmoothing } from './trade-shock-absorption.ts';
import { sanitizeExportCommitmentPipelineSmoothing } from './export-commitment-pipeline.ts';
import { sanitizeImportCommitmentPipelineSmoothing } from './import-commitment-pipeline.ts';
import { sanitizeTradeFlowCohesionSmoothing } from './trade-flow-cohesion.ts';
import { sanitizeTradeThroughputOrchestrationSmoothing } from './trade-throughput-orchestration.ts';
import { sanitizeCommitmentLedgerHarmonizationSmoothing } from './commitment-ledger-harmonization.ts';
import { sanitizeBilateralCargoSchedulingSmoothing } from './bilateral-cargo-scheduling.ts';
import { sanitizeCommitmentTurnCloseoutSmoothing } from './commitment-turn-closeout.ts';
import { sanitizeForwardSlotRolloverSmoothing } from './forward-slot-rollover.ts';
import { sanitizeBilateralSettlementReconciliationSmoothing } from './bilateral-settlement-reconciliation.ts';
import { sanitizeTradeSettlementContinuitySmoothing } from './trade-settlement-continuity.ts';
import { sanitizeForwardBookAnchorStabilizationSmoothing } from './forward-book-anchor-stabilization.ts';
import { sanitizeAnchoredBookReadinessSmoothing } from './anchored-book-readiness.ts';
import { sanitizeBilateralThroughputCertificationSmoothing } from './bilateral-throughput-certification.ts';
import { sanitizeCertifiedThroughputSustainmentSmoothing } from './certified-throughput-sustainment.ts';
import { sanitizeBilateralCapacityHandoffGateSmoothing } from './bilateral-capacity-handoff-gate.ts';
import { sanitizeCapacityHandoffAbsorptionSmoothing } from './capacity-handoff-absorption.ts';
import { sanitizeBilateralTradeWindowContinuitySmoothing } from './bilateral-trade-window-continuity.ts';
import { sanitizeTradeCycleSealVerificationSmoothing } from './trade-cycle-seal-verification.ts';
import { sanitizeBilateralCapacityRenewalGateSmoothing } from './bilateral-capacity-renewal-gate.ts';
import { sanitizeCapacityRenewalPrimingSmoothing } from './capacity-renewal-priming.ts';
import { sanitizeBilateralCycleReentryGateSmoothing } from './bilateral-cycle-reentry-gate.ts';
import { sanitizeCycleReentryStabilizationSmoothing } from './cycle-reentry-stabilization.ts';
import { sanitizeBilateralLoopResumptionGateSmoothing } from './bilateral-loop-resumption-gate.ts';
import { sanitizeResumedLoopContinuitySmoothing } from './resumed-loop-continuity.ts';
import { sanitizeBilateralCycleRestartAcknowledgmentSmoothing } from './bilateral-cycle-restart-acknowledgment.ts';
import { sanitizeAcknowledgedCyclePrimingSmoothing } from './acknowledged-cycle-priming.ts';
import { sanitizeBilateralCommitmentArcOpeningSmoothing } from './bilateral-commitment-arc-opening.ts';
import { sanitizeCommitmentArcContinuitySmoothing } from './commitment-arc-continuity.ts';
import { sanitizeBilateralForwardCommitmentAdmissionSmoothing } from './bilateral-forward-commitment-admission.ts';
import { sanitizeAdmittedForwardCommitmentContinuitySmoothing } from './admitted-forward-commitment-continuity.ts';
import { sanitizeBilateralCommitmentWindowHandoffSmoothing } from './bilateral-commitment-window-handoff.ts';
import { sanitizeCommitmentWindowSustainmentSmoothing } from './commitment-window-sustainment.ts';
import { sanitizeBilateralForwardCycleAdvanceGateSmoothing } from './bilateral-forward-cycle-advance-gate.ts';
import { sanitizeForwardCycleAdvanceContinuitySmoothing } from './forward-cycle-advance-continuity.ts';
import { sanitizeBilateralCommitmentLoopReopenGateSmoothing } from './bilateral-commitment-loop-reopen-gate.ts';
import { sanitizeReopenedCommitmentLoopContinuitySmoothing } from './reopened-commitment-loop-continuity.ts';
import { sanitizeBilateralForwardArcRechargeGateSmoothing } from './bilateral-forward-arc-recharge-gate.ts';
import { sanitizeForwardArcRechargeContinuitySmoothing } from './forward-arc-recharge-continuity.ts';
import { sanitizeBilateralRenewalArcPrimingGateSmoothing } from './bilateral-renewal-arc-priming-gate.ts';
import { sanitizeRenewalArcPrimingContinuitySmoothing } from './renewal-arc-priming-continuity.ts';
import { sanitizeBilateralNextArcOpenPrepGateSmoothing } from './bilateral-next-arc-open-prep-gate.ts';
import { sanitizeNextArcOpenPrepContinuitySmoothing } from './next-arc-open-prep-continuity.ts';
import { sanitizeBilateralPreparedArcOpeningHandoffSmoothing } from './bilateral-prepared-arc-opening-handoff.ts';
import { sanitizePreparedArcHandoffContinuitySmoothing } from './prepared-arc-handoff-continuity.ts';
import { sanitizeBilateralScaleLoopSealGateSmoothing } from './bilateral-scale-loop-seal-gate.ts';
import { sanitizeSealedScaleLoopContinuitySmoothing } from './sealed-scale-loop-continuity.ts';
import { sanitizeBilateralScaleWaveReentryGateSmoothing } from './bilateral-scale-wave-reentry-gate.ts';
import { sanitizeScaleWaveReentryContinuitySmoothing } from './scale-wave-reentry-continuity.ts';
import { sanitizeBilateralNextWavePrimingGateSmoothing } from './bilateral-next-wave-priming-gate.ts';
import { sanitizeNextWavePrimingContinuitySmoothing } from './next-wave-priming-continuity.ts';
import { sanitizeBilateralPrimedWaveLaunchGateSmoothing } from './bilateral-primed-wave-launch-gate.ts';
import { sanitizePartnerTrustScore } from './partner-trust.ts';
import type { TradeDisputeCase, TradePolicyInstrument } from './types.ts';

export function createEmptyGTELPersisted(): GTELPersisted {
  return {
    schemaVersion: 1,
    revision: 0,
    lastProcessedTurn: null,
    partnerAccess: {},
    commoditySmoothing: {},
    embargoCooldowns: {},
    recentEvents: [],
    agreements: [],
    activeShocks: [],
    partnerSanctions: {},
    firedShockScenarios: [],
    partnerTrust: {},
    tradePolicies: [],
    tradeDisputes: [],
    tradeCompliance: createEmptyTradeComplianceRecord(),
    importDependencySmoothing: {},
    diplomaticEngagement: {},
    tradeFinanceSmoothing: 0.62,
    partnerMixSmoothing: {},
    termsOfTradeSmoothing: 1,
    supplyChainResilienceSmoothing: 0.58,
    foreignExchangeSmoothing: 1,
    retaliationPressureSmoothing: 0.22,
    deescalationMomentumSmoothing: 0.28,
    exportCapacitySmoothing: 0.62,
    reconciliationProgressSmoothing: 0.24,
    maritimeRiskSmoothing: 0.22,
    preferentialUtilizationSmoothing: 0.48,
    enforcementIntensitySmoothing: 0.26,
    exportInsuranceStackSmoothing: 0.56,
    accessRestorationSmoothing: 0.3,
    tradeCorridorSmoothing: 0.54,
    sanctionsSpilloverSmoothing: 0.24,
    tradeFxHedgingSmoothing: 0.5,
    importLanePressureSmoothing: 0.38,
    diplomaticTradeCoherenceSmoothing: 0.48,
    tradeBalanceStabilizationSmoothing: 0.52,
    tradeShockAbsorptionSmoothing: 0.54,
    exportCommitmentPipelineSmoothing: 0.52,
    importCommitmentPipelineSmoothing: 0.5,
    tradeFlowCohesionSmoothing: 0.52,
    tradeThroughputOrchestrationSmoothing: 0.52,
    commitmentLedgerHarmonizationSmoothing: 0.52,
    bilateralCargoSchedulingSmoothing: 0.52,
    commitmentTurnCloseoutSmoothing: 0.52,
    forwardSlotRolloverSmoothing: 0.52,
    bilateralSettlementReconciliationSmoothing: 0.52,
    tradeSettlementContinuitySmoothing: 0.52,
    forwardBookAnchorStabilizationSmoothing: 0.52,
    anchoredBookReadinessSmoothing: 0.52,
    bilateralThroughputCertificationSmoothing: 0.52,
    certifiedThroughputSustainmentSmoothing: 0.52,
    bilateralCapacityHandoffGateSmoothing: 0.52,
    capacityHandoffAbsorptionSmoothing: 0.52,
    bilateralTradeWindowContinuitySmoothing: 0.52,
    tradeCycleSealVerificationSmoothing: 0.52,
    bilateralCapacityRenewalGateSmoothing: 0.52,
    capacityRenewalPrimingSmoothing: 0.52,
    bilateralCycleReentryGateSmoothing: 0.52,
    cycleReentryStabilizationSmoothing: 0.52,
    bilateralLoopResumptionGateSmoothing: 0.52,
    resumedLoopContinuitySmoothing: 0.52,
    bilateralCycleRestartAcknowledgmentSmoothing: 0.52,
    acknowledgedCyclePrimingSmoothing: 0.52,
    bilateralCommitmentArcOpeningSmoothing: 0.52,
    commitmentArcContinuitySmoothing: 0.52,
    bilateralForwardCommitmentAdmissionSmoothing: 0.52,
    admittedForwardCommitmentContinuitySmoothing: 0.52,
    bilateralCommitmentWindowHandoffSmoothing: 0.52,
    commitmentWindowSustainmentSmoothing: 0.52,
    bilateralForwardCycleAdvanceGateSmoothing: 0.52,
    forwardCycleAdvanceContinuitySmoothing: 0.52,
    bilateralCommitmentLoopReopenGateSmoothing: 0.52,
    reopenedCommitmentLoopContinuitySmoothing: 0.52,
    bilateralForwardArcRechargeGateSmoothing: 0.52,
    forwardArcRechargeContinuitySmoothing: 0.52,
    bilateralRenewalArcPrimingGateSmoothing: 0.52,
    renewalArcPrimingContinuitySmoothing: 0.52,
    bilateralNextArcOpenPrepGateSmoothing: 0.52,
    nextArcOpenPrepContinuitySmoothing: 0.52,
    bilateralPreparedArcOpeningHandoffSmoothing: 0.52,
    preparedArcHandoffContinuitySmoothing: 0.52,
    bilateralScaleLoopSealGateSmoothing: 0.52,
    sealedScaleLoopContinuitySmoothing: 0.52,
    bilateralScaleWaveReentryGateSmoothing: 0.52,
    scaleWaveReentryContinuitySmoothing: 0.52,
    bilateralNextWavePrimingGateSmoothing: 0.52,
    nextWavePrimingContinuitySmoothing: 0.52,
    bilateralPrimedWaveLaunchGateSmoothing: 0.52,
  };
}

function sanitizeAgreement(raw: unknown): TradeAgreementRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.templateId !== 'string') return null;
  const partnerId = String(r.partnerId || '') as GTELPartnerId;
  if (!GTEL_PARTNER_DEFS.some(p => p.id === partnerId)) return null;
  const status = ['draft', 'negotiating', 'ratified', 'suspended', 'expired'].includes(String(r.status))
    ? (r.status as TradeAgreementRecord['status'])
    : 'draft';
  const tariffLines = (Array.isArray(r.tariffLines) ? r.tariffLines : [])
    .filter((t: unknown) => t && typeof t === 'object')
    .slice(0, 8)
    .map((t: any) => ({
      commodity: GTEL_COMMODITIES.includes(t.commodity) ? t.commodity : 'services',
      tariffCut: gtelClamp(gtelNum(t.tariffCut, 0), 0, 0.5),
      quotaCap: t.quotaCap == null ? null : Math.max(0, Math.floor(gtelNum(t.quotaCap, 0))),
    }));
  return {
    id: r.id.slice(0, 80),
    templateId: String(r.templateId).slice(0, 40),
    title: String(r.title || 'Trade agreement').slice(0, 120),
    partnerId,
    counterpartyActorIds: (Array.isArray(r.counterpartyActorIds) ? r.counterpartyActorIds : []).map(String).slice(0, 4),
    status,
    ratifiedTurn: r.ratifiedTurn == null ? null : Math.max(1, Math.floor(gtelNum(r.ratifiedTurn, 1))),
    expiresTurn: r.expiresTurn == null ? null : Math.max(1, Math.floor(gtelNum(r.expiresTurn, 1))),
    tariffLines,
    accessBoost: gtelClamp(gtelNum(r.accessBoost, 0.05), 0, 0.25),
    notes: (Array.isArray(r.notes) ? r.notes : []).map(String).slice(0, 6),
  };
}

export function sanitizeGTELPersisted(raw: unknown, turn = 1): GTELPersisted {
  const base = createEmptyGTELPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  base.revision = Math.max(0, Math.floor(gtelNum(r.revision, 0)));
  base.lastProcessedTurn = r.lastProcessedTurn === null ? null : Math.max(1, Math.floor(gtelNum(r.lastProcessedTurn, turn)));
  if (r.partnerAccess && typeof r.partnerAccess === 'object') {
    Object.entries(r.partnerAccess as Record<string, string>).forEach(([k, v]) => {
      if (GTEL_PARTNER_DEFS.some(p => p.id === k) && ['blocked', 'restricted', 'normal', 'preferred', 'strategic'].includes(v)) {
        base.partnerAccess[k as GTELPartnerId] = v as GTELAccessBand;
      }
    });
  }
  if (r.commoditySmoothing && typeof r.commoditySmoothing === 'object') {
    GTEL_COMMODITIES.forEach(c => {
      const v = gtelNum((r.commoditySmoothing as Record<string, number>)[c], GTEL_BASE_COMMODITY_INDEX[c]);
      base.commoditySmoothing[c] = gtelClamp(v, 40, 180);
    });
  }
  if (r.embargoCooldowns && typeof r.embargoCooldowns === 'object') {
    Object.entries(r.embargoCooldowns as Record<string, number>)
      .slice(0, 12)
      .forEach(([k, v]) => {
        base.embargoCooldowns[k.slice(0, 40)] = Math.max(0, Math.floor(gtelNum(v, 0)));
      });
  }
  if (Array.isArray(r.recentEvents)) {
    base.recentEvents = r.recentEvents
      .filter((e: unknown) => e && typeof e === 'object' && typeof (e as any).id === 'string')
      .slice(-GTEL_LIMITS.history)
      .map((e: any) => ({
        id: String(e.id).slice(0, 60),
        turn: Math.max(1, Math.floor(gtelNum(e.turn, turn))),
        kind: String(e.kind || 'trade').slice(0, 24),
        text: String(e.text || '').slice(0, 200),
      }));
  }
  if (Array.isArray(r.agreements)) {
    base.agreements = r.agreements.map(sanitizeAgreement).filter(Boolean).slice(-GTEL_LIMITS.maxAgreements) as TradeAgreementRecord[];
  }
  if (Array.isArray(r.activeShocks)) {
    base.activeShocks = r.activeShocks
      .filter((s: unknown) => s && typeof s === 'object' && typeof (s as any).shockId === 'string')
      .slice(0, 8)
      .map((s: any) => ({
        shockId: String(s.shockId).slice(0, 40),
        startedTurn: Math.max(1, Math.floor(gtelNum(s.startedTurn, turn))),
        endsTurn: Math.max(1, Math.floor(gtelNum(s.endsTurn, turn + 1))),
        remainingIntensity: gtelClamp(gtelNum(s.remainingIntensity, 1), 0.1, 1),
      }));
  }
  if (r.partnerSanctions && typeof r.partnerSanctions === 'object') {
    Object.entries(r.partnerSanctions as Record<string, unknown>).slice(0, 6).forEach(([k, v]) => {
      if (!GTEL_PARTNER_DEFS.some(p => p.id === k)) return;
      base.partnerSanctions![k as GTELPartnerId] = sanitizePartnerSanctionRegime(v, k as GTELPartnerId);
    });
  }
  if (Array.isArray(r.firedShockScenarios)) {
    base.firedShockScenarios = r.firedShockScenarios.map(String).slice(-16);
  }
  if (r.partnerTrust && typeof r.partnerTrust === 'object') {
    Object.entries(r.partnerTrust as Record<string, unknown>).slice(0, 6).forEach(([k, v]) => {
      if (!GTEL_PARTNER_DEFS.some(p => p.id === k)) return;
      base.partnerTrust![k as GTELPartnerId] = sanitizePartnerTrustScore(v, k as GTELPartnerId, turn);
    });
  }
  if (Array.isArray(r.tradePolicies)) {
    base.tradePolicies = r.tradePolicies
      .filter((p: unknown) => p && typeof p === 'object')
      .slice(-8)
      .map((p: any) => ({
        id: String(p.id || '').slice(0, 60),
        kind: ['export_quota_relief', 'tariff_surge', 'preferential_lane', 'diversification_push'].includes(p.kind)
          ? p.kind
          : 'diversification_push',
        title: String(p.title || 'Policy').slice(0, 100),
        partnerId: GTEL_PARTNER_DEFS.some(x => x.id === p.partnerId) ? p.partnerId : null,
        commodity: GTEL_COMMODITIES.includes(p.commodity) ? p.commodity : null,
        status: ['proposed', 'active', 'expired', 'suspended'].includes(p.status) ? p.status : 'active',
        activatedTurn: Math.max(1, Math.floor(gtelNum(p.activatedTurn, turn))),
        expiresTurn: p.expiresTurn == null ? null : Math.max(1, Math.floor(gtelNum(p.expiresTurn, turn))),
        accessDelta: gtelClamp(gtelNum(p.accessDelta, 0), -0.3, 0.3),
        commodityDelta: gtelClamp(gtelNum(p.commodityDelta, 0), -0.3, 0.3),
        domesticStressDelta: gtelClamp(gtelNum(p.domesticStressDelta, 0), -0.1, 0.2),
        summary: String(p.summary || '').slice(0, 200),
      })) as TradePolicyInstrument[];
  }
  if (Array.isArray(r.tradeDisputes)) {
    base.tradeDisputes = r.tradeDisputes
      .filter((d: unknown) => d && typeof d === 'object')
      .slice(-12)
      .map((d: any) => ({
        id: String(d.id || '').slice(0, 60),
        partnerId: GTEL_PARTNER_DEFS.some(x => x.id === d.partnerId) ? d.partnerId : 'asia_pacific',
        status: ['open', 'mediation', 'resolved', 'escalated'].includes(d.status) ? d.status : 'open',
        openedTurn: Math.max(1, Math.floor(gtelNum(d.openedTurn, turn))),
        resolvedTurn: d.resolvedTurn == null ? null : Math.max(1, Math.floor(gtelNum(d.resolvedTurn, turn))),
        subject: String(d.subject || '').slice(0, 160),
        requestedRelief: ['sanction_step_down', 'shock_containment', 'quota_restoration'].includes(d.requestedRelief)
          ? d.requestedRelief
          : 'sanction_step_down',
        severity: gtelClamp(gtelNum(d.severity, 0.5), 0.1, 1),
      })) as TradeDisputeCase[];
  }
  base.tradeCompliance = sanitizeTradeComplianceRecord(r.tradeCompliance, turn);
  base.importDependencySmoothing = sanitizeImportDependencySmoothing(r.importDependencySmoothing);
  if (r.diplomaticEngagement && typeof r.diplomaticEngagement === 'object') {
    Object.entries(r.diplomaticEngagement as Record<string, unknown>).slice(0, 6).forEach(([k, v]) => {
      if (!GTEL_PARTNER_DEFS.some(p => p.id === k) || !v || typeof v !== 'object') return;
      const row = v as Record<string, unknown>;
      base.diplomaticEngagement![k as GTELPartnerId] = {
        momentum: gtelClamp(gtelNum(row.momentum, 0.4), 0.08, 0.98),
        lastEventTurn: Math.max(1, Math.floor(gtelNum(row.lastEventTurn, turn))),
        highlights: (Array.isArray(row.highlights) ? row.highlights : []).map(String).slice(0, 4),
      };
    });
  }
  base.tradeFinanceSmoothing = sanitizeTradeFinanceSmoothing(r.tradeFinanceSmoothing);
  base.partnerMixSmoothing = sanitizePartnerMixSmoothing(r.partnerMixSmoothing);
  base.termsOfTradeSmoothing = sanitizeTermsOfTradeSmoothing(r.termsOfTradeSmoothing);
  base.supplyChainResilienceSmoothing = sanitizeSupplyChainResilienceSmoothing(r.supplyChainResilienceSmoothing);
  base.foreignExchangeSmoothing = sanitizeForeignExchangeSmoothing(r.foreignExchangeSmoothing);
  base.retaliationPressureSmoothing = sanitizeRetaliationPressureSmoothing(r.retaliationPressureSmoothing);
  base.deescalationMomentumSmoothing = sanitizeDeescalationMomentumSmoothing(r.deescalationMomentumSmoothing);
  base.exportCapacitySmoothing = sanitizeExportCapacitySmoothing(r.exportCapacitySmoothing);
  base.reconciliationProgressSmoothing = sanitizeReconciliationProgressSmoothing(r.reconciliationProgressSmoothing);
  base.maritimeRiskSmoothing = sanitizeMaritimeRiskSmoothing(r.maritimeRiskSmoothing);
  base.preferentialUtilizationSmoothing = sanitizePreferentialUtilizationSmoothing(
    r.preferentialUtilizationSmoothing,
  );
  base.enforcementIntensitySmoothing = sanitizeEnforcementIntensitySmoothing(r.enforcementIntensitySmoothing);
  base.exportInsuranceStackSmoothing = sanitizeExportInsuranceStackSmoothing(r.exportInsuranceStackSmoothing);
  base.accessRestorationSmoothing = sanitizeAccessRestorationSmoothing(r.accessRestorationSmoothing);
  base.tradeCorridorSmoothing = sanitizeTradeCorridorSmoothing(r.tradeCorridorSmoothing);
  base.sanctionsSpilloverSmoothing = sanitizeSanctionsSpilloverSmoothing(r.sanctionsSpilloverSmoothing);
  base.tradeFxHedgingSmoothing = sanitizeTradeFxHedgingSmoothing(r.tradeFxHedgingSmoothing);
  base.importLanePressureSmoothing = sanitizeImportLanePressureSmoothing(r.importLanePressureSmoothing);
  base.diplomaticTradeCoherenceSmoothing = sanitizeDiplomaticTradeCoherenceSmoothing(
    r.diplomaticTradeCoherenceSmoothing,
  );
  base.tradeBalanceStabilizationSmoothing = sanitizeTradeBalanceStabilizationSmoothing(
    r.tradeBalanceStabilizationSmoothing,
  );
  base.tradeShockAbsorptionSmoothing = sanitizeTradeShockAbsorptionSmoothing(r.tradeShockAbsorptionSmoothing);
  base.exportCommitmentPipelineSmoothing = sanitizeExportCommitmentPipelineSmoothing(
    r.exportCommitmentPipelineSmoothing,
  );
  base.importCommitmentPipelineSmoothing = sanitizeImportCommitmentPipelineSmoothing(
    r.importCommitmentPipelineSmoothing,
  );
  base.tradeFlowCohesionSmoothing = sanitizeTradeFlowCohesionSmoothing(r.tradeFlowCohesionSmoothing);
  base.tradeThroughputOrchestrationSmoothing = sanitizeTradeThroughputOrchestrationSmoothing(
    r.tradeThroughputOrchestrationSmoothing,
  );
  base.commitmentLedgerHarmonizationSmoothing = sanitizeCommitmentLedgerHarmonizationSmoothing(
    r.commitmentLedgerHarmonizationSmoothing,
  );
  base.bilateralCargoSchedulingSmoothing = sanitizeBilateralCargoSchedulingSmoothing(
    r.bilateralCargoSchedulingSmoothing,
  );
  base.commitmentTurnCloseoutSmoothing = sanitizeCommitmentTurnCloseoutSmoothing(r.commitmentTurnCloseoutSmoothing);
  base.forwardSlotRolloverSmoothing = sanitizeForwardSlotRolloverSmoothing(r.forwardSlotRolloverSmoothing);
  base.bilateralSettlementReconciliationSmoothing = sanitizeBilateralSettlementReconciliationSmoothing(
    r.bilateralSettlementReconciliationSmoothing,
  );
  base.tradeSettlementContinuitySmoothing = sanitizeTradeSettlementContinuitySmoothing(
    r.tradeSettlementContinuitySmoothing,
  );
  base.forwardBookAnchorStabilizationSmoothing = sanitizeForwardBookAnchorStabilizationSmoothing(
    r.forwardBookAnchorStabilizationSmoothing,
  );
  base.anchoredBookReadinessSmoothing = sanitizeAnchoredBookReadinessSmoothing(r.anchoredBookReadinessSmoothing);
  base.bilateralThroughputCertificationSmoothing = sanitizeBilateralThroughputCertificationSmoothing(
    r.bilateralThroughputCertificationSmoothing,
  );
  base.certifiedThroughputSustainmentSmoothing = sanitizeCertifiedThroughputSustainmentSmoothing(
    r.certifiedThroughputSustainmentSmoothing,
  );
  base.bilateralCapacityHandoffGateSmoothing = sanitizeBilateralCapacityHandoffGateSmoothing(
    r.bilateralCapacityHandoffGateSmoothing,
  );
  base.capacityHandoffAbsorptionSmoothing = sanitizeCapacityHandoffAbsorptionSmoothing(
    r.capacityHandoffAbsorptionSmoothing,
  );
  base.bilateralTradeWindowContinuitySmoothing = sanitizeBilateralTradeWindowContinuitySmoothing(
    r.bilateralTradeWindowContinuitySmoothing,
  );
  base.tradeCycleSealVerificationSmoothing = sanitizeTradeCycleSealVerificationSmoothing(
    r.tradeCycleSealVerificationSmoothing,
  );
  base.bilateralCapacityRenewalGateSmoothing = sanitizeBilateralCapacityRenewalGateSmoothing(
    r.bilateralCapacityRenewalGateSmoothing,
  );
  base.capacityRenewalPrimingSmoothing = sanitizeCapacityRenewalPrimingSmoothing(r.capacityRenewalPrimingSmoothing);
  base.bilateralCycleReentryGateSmoothing = sanitizeBilateralCycleReentryGateSmoothing(
    r.bilateralCycleReentryGateSmoothing,
  );
  base.cycleReentryStabilizationSmoothing = sanitizeCycleReentryStabilizationSmoothing(
    r.cycleReentryStabilizationSmoothing,
  );
  base.bilateralLoopResumptionGateSmoothing = sanitizeBilateralLoopResumptionGateSmoothing(
    r.bilateralLoopResumptionGateSmoothing,
  );
  base.resumedLoopContinuitySmoothing = sanitizeResumedLoopContinuitySmoothing(r.resumedLoopContinuitySmoothing);
  base.bilateralCycleRestartAcknowledgmentSmoothing = sanitizeBilateralCycleRestartAcknowledgmentSmoothing(
    r.bilateralCycleRestartAcknowledgmentSmoothing,
  );
  base.acknowledgedCyclePrimingSmoothing = sanitizeAcknowledgedCyclePrimingSmoothing(
    r.acknowledgedCyclePrimingSmoothing,
  );
  base.bilateralCommitmentArcOpeningSmoothing = sanitizeBilateralCommitmentArcOpeningSmoothing(
    r.bilateralCommitmentArcOpeningSmoothing,
  );
  base.commitmentArcContinuitySmoothing = sanitizeCommitmentArcContinuitySmoothing(
    r.commitmentArcContinuitySmoothing,
  );
  base.bilateralForwardCommitmentAdmissionSmoothing = sanitizeBilateralForwardCommitmentAdmissionSmoothing(
    r.bilateralForwardCommitmentAdmissionSmoothing,
  );
  base.admittedForwardCommitmentContinuitySmoothing = sanitizeAdmittedForwardCommitmentContinuitySmoothing(
    r.admittedForwardCommitmentContinuitySmoothing,
  );
  base.bilateralCommitmentWindowHandoffSmoothing = sanitizeBilateralCommitmentWindowHandoffSmoothing(
    r.bilateralCommitmentWindowHandoffSmoothing,
  );
  base.commitmentWindowSustainmentSmoothing = sanitizeCommitmentWindowSustainmentSmoothing(
    r.commitmentWindowSustainmentSmoothing,
  );
  base.bilateralForwardCycleAdvanceGateSmoothing = sanitizeBilateralForwardCycleAdvanceGateSmoothing(
    r.bilateralForwardCycleAdvanceGateSmoothing,
  );
  base.forwardCycleAdvanceContinuitySmoothing = sanitizeForwardCycleAdvanceContinuitySmoothing(
    r.forwardCycleAdvanceContinuitySmoothing,
  );
  base.bilateralCommitmentLoopReopenGateSmoothing = sanitizeBilateralCommitmentLoopReopenGateSmoothing(
    r.bilateralCommitmentLoopReopenGateSmoothing,
  );
  base.reopenedCommitmentLoopContinuitySmoothing = sanitizeReopenedCommitmentLoopContinuitySmoothing(
    r.reopenedCommitmentLoopContinuitySmoothing,
  );
  base.bilateralForwardArcRechargeGateSmoothing = sanitizeBilateralForwardArcRechargeGateSmoothing(
    r.bilateralForwardArcRechargeGateSmoothing,
  );
  base.forwardArcRechargeContinuitySmoothing = sanitizeForwardArcRechargeContinuitySmoothing(
    r.forwardArcRechargeContinuitySmoothing,
  );
  base.bilateralRenewalArcPrimingGateSmoothing = sanitizeBilateralRenewalArcPrimingGateSmoothing(
    r.bilateralRenewalArcPrimingGateSmoothing,
  );
  base.renewalArcPrimingContinuitySmoothing = sanitizeRenewalArcPrimingContinuitySmoothing(
    r.renewalArcPrimingContinuitySmoothing,
  );
  base.bilateralNextArcOpenPrepGateSmoothing = sanitizeBilateralNextArcOpenPrepGateSmoothing(
    r.bilateralNextArcOpenPrepGateSmoothing,
  );
  base.nextArcOpenPrepContinuitySmoothing = sanitizeNextArcOpenPrepContinuitySmoothing(
    r.nextArcOpenPrepContinuitySmoothing,
  );
  base.bilateralPreparedArcOpeningHandoffSmoothing = sanitizeBilateralPreparedArcOpeningHandoffSmoothing(
    r.bilateralPreparedArcOpeningHandoffSmoothing,
  );
  base.preparedArcHandoffContinuitySmoothing = sanitizePreparedArcHandoffContinuitySmoothing(
    r.preparedArcHandoffContinuitySmoothing,
  );
  base.bilateralScaleLoopSealGateSmoothing = sanitizeBilateralScaleLoopSealGateSmoothing(
    r.bilateralScaleLoopSealGateSmoothing,
  );
  base.sealedScaleLoopContinuitySmoothing = sanitizeSealedScaleLoopContinuitySmoothing(
    r.sealedScaleLoopContinuitySmoothing,
  );
  base.bilateralScaleWaveReentryGateSmoothing = sanitizeBilateralScaleWaveReentryGateSmoothing(
    r.bilateralScaleWaveReentryGateSmoothing,
  );
  base.scaleWaveReentryContinuitySmoothing = sanitizeScaleWaveReentryContinuitySmoothing(
    r.scaleWaveReentryContinuitySmoothing,
  );
  base.bilateralNextWavePrimingGateSmoothing = sanitizeBilateralNextWavePrimingGateSmoothing(
    r.bilateralNextWavePrimingGateSmoothing,
  );
  base.nextWavePrimingContinuitySmoothing = sanitizeNextWavePrimingContinuitySmoothing(
    r.nextWavePrimingContinuitySmoothing,
  );
  base.bilateralPrimedWaveLaunchGateSmoothing = sanitizeBilateralPrimedWaveLaunchGateSmoothing(
    r.bilateralPrimedWaveLaunchGateSmoothing,
  );
  return base;
}
