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
  return base;
}
