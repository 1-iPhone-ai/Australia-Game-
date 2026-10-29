import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import { STATE_FISCAL_PROFILES } from './catalog/state-profiles';
import type {
  FederalStateReconciliation,
  IntergovernmentalTransferLine,
  TransferInstrumentKind
} from './types';
import { FEDERAL_STATE_SCHEMA } from './types';

const INSTRUMENT_SHARE: Record<TransferInstrumentKind, number> = {
  gst_igr: 0.42,
  health_specific: 0.22,
  education_specific: 0.18,
  infrastructure_partner: 0.1,
  general_purpose: 0.08
};

function equalizationFactor(capacityIndex: number): number {
  const rel = 1 / Math.max(0.5, capacityIndex);
  return Math.min(1.35, Math.max(0.75, rel));
}

function buildTransfer(
  stateCode: IntergovernmentalTransferLine['stateCode'],
  instrument: TransferInstrumentKind,
  poolSlice: number,
  profile: (typeof STATE_FISCAL_PROFILES)[0]
): IntergovernmentalTransferLine {
  const base = poolSlice * profile.populationWeight;
  const eq = equalizationFactor(profile.fiscalCapacityIndex);
  const remote = 1 + profile.remoteLoadFactor * (instrument === 'general_purpose' ? 0.5 : 0.25);
  const entitlementPoints = Math.round(base * eq * remote * 10) / 10;
  let adjustmentPoints = 0;
  if (profile.fiscalCapacityIndex > 1.08 && instrument === 'gst_igr') {
    adjustmentPoints = -Math.round(entitlementPoints * 0.06 * 10) / 10;
  }
  if (profile.fiscalCapacityIndex < 0.85) {
    adjustmentPoints += Math.round(entitlementPoints * 0.08 * 10) / 10;
  }
  const netPoints = Math.round((entitlementPoints + adjustmentPoints) * 10) / 10;
  return {
    stateCode,
    instrument,
    entitlementPoints,
    adjustmentPoints,
    netPoints,
    explanation: `${instrument} for ${stateCode}: pop=${profile.populationWeight}, eq=${eq.toFixed(2)}, remote=${remote.toFixed(2)}.`
  };
}

export function reconcileFederalStateTransfers(
  turn: number,
  v1012: V1012FiscalSnapshot,
  tolerancePoints = 3.5
): FederalStateReconciliation {
  const federalRevenuePool = Math.max(
    10,
    Math.round(v1012.revenueCapacity * 0.55 + Math.max(0, v1012.fiscalHeadroom * 0.15))
  );
  const transfers: IntergovernmentalTransferLine[] = [];

  for (const profile of STATE_FISCAL_PROFILES) {
    for (const [instrument, share] of Object.entries(INSTRUMENT_SHARE) as [TransferInstrumentKind, number][]) {
      const poolSlice = federalRevenuePool * share;
      transfers.push(buildTransfer(profile.stateCode, instrument, poolSlice, profile));
    }
  }

  const totalEntitlements = Math.round(transfers.reduce((s, t) => s + t.entitlementPoints, 0) * 10) / 10;
  const totalAdjustments = Math.round(transfers.reduce((s, t) => s + t.adjustmentPoints, 0) * 10) / 10;
  let totalNet = Math.round(transfers.reduce((s, t) => s + t.netPoints, 0) * 10) / 10;

  if (totalNet > 0 && Math.abs(totalNet - federalRevenuePool) > tolerancePoints) {
    const scale = federalRevenuePool / totalNet;
    for (const t of transfers) {
      t.netPoints = Math.round(t.netPoints * scale * 10) / 10;
      t.entitlementPoints = Math.round(t.entitlementPoints * scale * 10) / 10;
      t.adjustmentPoints = Math.round(t.adjustmentPoints * scale * 10) / 10;
    }
    totalNet = Math.round(transfers.reduce((s, t) => s + t.netPoints, 0) * 10) / 10;
  }

  const residualFederal = Math.round((federalRevenuePool - totalNet) * 10) / 10;

  const warnings: string[] = [];
  if (Math.abs(residualFederal) > tolerancePoints + federalRevenuePool * 0.08) {
    warnings.push('Federal residual outside IGR tolerance — review pool definition or adjustments.');
  }
  if (v1012.pressure === 'critical') {
    warnings.push('Critical national pressure — state transfer growth may be deferred (policy hook).');
  }

  const verticalImbalanceIndex = Math.round((totalNet / Math.max(1, federalRevenuePool)) * 100) / 100;
  if (verticalImbalanceIndex > 0.92) {
    warnings.push('High vertical transfer share — limited federal discretionary room.');
  }

  const reconciled =
    Math.abs(residualFederal) <= tolerancePoints + federalRevenuePool * 0.06 &&
    totalEntitlements > 0 &&
    transfers.length === STATE_FISCAL_PROFILES.length * Object.keys(INSTRUMENT_SHARE).length;

  return {
    schemaVersion: FEDERAL_STATE_SCHEMA,
    turn,
    federalRevenuePool,
    totalEntitlements,
    totalAdjustments,
    residualFederal,
    reconciled,
    tolerancePoints,
    transfers,
    verticalImbalanceIndex,
    warnings
  };
}

export function sumTransfersByState(
  reconciliation: FederalStateReconciliation,
  stateCode: IntergovernmentalTransferLine['stateCode']
): number {
  return reconciliation.transfers
    .filter(t => t.stateCode === stateCode)
    .reduce((s, t) => s + t.netPoints, 0);
}
